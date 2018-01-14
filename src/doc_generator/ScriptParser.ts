import parse = require("comment-parser");
import DocExample from "../docs_models/DocExample";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";
import DocScript from "../docs_models/DocScript";
import { IGMScript } from "../IGMInterfaces";
import ReporterManager from "../reporter/ReporterManager";
import OutputConfig from "./OutputConfig";
import StringUtils from "./StringUtils";

interface IGMLFeatures {
	/**
	 * Number of arguments
	 */
	argumentCount: number;
	/**
	 * Has optional arguments? (argument[i])
	 */
	optionalArguments: boolean;
	/**
	 * Has a return statement?
	 */
	hasReturn: boolean;
}

/**
 * Class for parsing the GML scripts and JSDocs comments inside those scripts
 */
export default class ScriptParser {

	/**
	 * config object
	 */
	private _config: OutputConfig;

	/**
	 * regex to remove the comments from the gml
	 */
	private _removeCommentsRegex: RegExp = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

	/**
	 * Regex to remove the strings from the gml
	 */
	private _removeStringsRegex: RegExp = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/;

	/**
	 * Regex to find arguments0..argument1..etc
	 */
	private _findFixedArgumentsRegex: RegExp = /[\s{(]argument([0-9]+)[\s;})]/g;

	/**
	 * Regex to find optional arguments. arguments[0]..argument[1]..etc
	 */
	private _findArrayArgumentsRegex: RegExp = /[\s{(]argument\[([0-9]+)\][\s;})]/g;

	/**
	 * Regex to find return statements
	 */
	private _findReturnRegex: RegExp = /[\s{(;]return[\s;})]/;

	/**
	 * Creates a ScriptParser instance
	 */
	public constructor(config: OutputConfig) {
		this._config = config;
	}

	/**
	 * Parses a GMScript
	 * @param script An array with DocScript objects
	 */
	public parseScript(script: IGMScript): DocScript[] {
		const arr = [];
		for (const [name, text] of script.subScripts()) {
			const docScript = this._extractDocumentation(name, text);

			if (this._config.markUnderscoreScriptsAsPrivate && name.charAt(0) === "_") {
				docScript.private = true;
			}
			if (docScript.private && this._config.ignorePrivateScripts) {
				continue;
			}
			if (docScript.undocumented) {
				if (this._config.warnUndocumentedScripts) {
					ReporterManager.reporter.warn(`Script "${name}" is undocumented.`);
				}
				if (this._config.ignoreUndocumentedScripts) {
					continue;
				}
			}
			if (!docScript.description) {
				if (this._config.warnNoDescriptionScripts) {
					ReporterManager.reporter.warn(`Script "${name}" has no description.`);
				}
				if (this._config.ignoreNoDescriptionScripts) {
					continue;
				}
			}

			const features = this._extractGMLFeatures(text);
			const docsN = docScript.params.length;
			const argsN = features.argumentCount;
			if (docsN === 0) {
				if (this._config.warnUndocumentedArgumentsScripts) {
					ReporterManager.reporter.warn(`Script "${name}" uses arguments but does not have any @param JSDoc comment.`);
				}
				if (this._config.ignoreUndocumentedArgumentsScripts) {
					continue;
				}
			}
			if (argsN !== docsN) {
				if (this._config.warnMismatchingArgumentsScripts) {
					ReporterManager.reporter.warn(`Script "${name}" uses ${argsN} but has documentation for ${docsN} arguments.`);
				}
				if (this._config.ignoreMismatchingArgumentsScripts) {
					continue;
				}
			}

			arr.push(docScript);
		}
		return arr;
	}

	/**
	 * Parses a gml script string and extracts all the documentation for a passed script
	 * and returns a new DocScript object.
	 * @param name The script name
	 * @param text The script content
	 * @returns A new DocStript object
	 */
	private _extractDocumentation(name: string, text: string): DocScript {

		const comments = parse(text);

		const script = new DocScript();
		script.name = name;

		for (const comment of comments) {
			if (comment.description) {
				script.undocumented = false;
				script.description = StringUtils.markdown2Html(comment.description);
			}
			for (const tag of comment.tags) {
				this._parseTag(tag, script);
			}
		}
		return script;
	}

	/**
	 * Parses a GML code and returns a GMLFeatures object with the features of that GML code
	 * @param text The GML code to parse
	 * @return a GMLFeatures object
	 */
	private _extractGMLFeatures(text: string): IGMLFeatures {
		// Removes single and multiline comments.
		// See: https://stackoverflow.com/a/15123777/2022985
		text = text.replace(this._removeCommentsRegex, "$1");

		// Removes strings (Double and single quoted strings)
		// See: https://stackoverflow.com/a/17231632/2022985
		text = text.replace(this._removeStringsRegex, "");

		const data: IGMLFeatures = {
			argumentCount: 0,
			optionalArguments: false,
			hasReturn: false,
		};

		let result: RegExpExecArray | null;
		// Match: argument0, argument1, argument2... etc.
		result = this._findFixedArgumentsRegex.exec(text);
		while (result) {
			data.argumentCount = Math.max(data.argumentCount, parseInt(result[1], 10) + 1);
			result = this._findFixedArgumentsRegex.exec(text);
		}

		// March argument[0], argument[1], argument[2]... etc
		result = this._findArrayArgumentsRegex.exec(text);
		while (result) {
			data.argumentCount = Math.max(data.argumentCount, parseInt(result[1], 10) + 1);
			data.optionalArguments = true;
			result = this._findArrayArgumentsRegex.exec(text);
		}

		// Match return statements
		data.hasReturn = (text.match(this._findReturnRegex) !== null);

		return data;
	}

	/**
	 * Parses the specified Tag and inserts the corresponding data to the DocStript object
	 * @param tag The Tag to parse
	 * @param script The DocScript to insert the extracted tag data
	 * @returns true if some data could be extracted from the tag
	 */
	private _parseTag(tag: CommentParser.Tag, script: DocScript): boolean {
		switch (tag.tag.toLowerCase()) {
			case "param":
			case "arg":
			case "argument":
				script.params.push(this._createParam(tag));
				script.undocumented = false;
				break;
			case "description":
			case "desc":
			case "private": // Private works in the same way as a description
				script.description = StringUtils.markdown2Html(this._reconstructTag(tag));
				script.undocumented = false;
				if (tag.tag.toLowerCase() === "private") {
					script.private = true;
				}
				break;
			case "returns":
			case "return":
				script.returns = script.returns || new DocReturns();
				script.returns.description = tag.description;
				script.returns.type = tag.type;
				script.undocumented = false;
				break;
			case "example":
				script.examples.push(this._createExample(tag));
				script.undocumented = false;
				break;
			case "function":
			case "func":
			case "method":
				const name = this._reconstructTag(tag);
				if (name !== script.name && this._config.warnMismatchingFunctionName) {
					ReporterManager.reporter.warn(`Script "${script.name}" has a mismatching @function name "${name}"`);
				}
				break;
			default:
				if (this._config.warnUnrecognizedTags) {
					ReporterManager.reporter.warn(`Unrecognized tag "${tag.tag.toLowerCase()}" at script "${script.name}"`);
				}
				return false;
		}
		return false;
	}

	/**
	 * Parses an example tag and creates a DocExample object
	 * @param tag The example tag
	 */
	private _createExample(tag: CommentParser.Tag): DocExample {
		const example = new DocExample();
		let str = this._reconstructTag(tag);
		str = StringUtils.stripInitialLineFeeds(str);
		example.code = StringUtils.escapeHtml(str);
		return example;
	}

	/**
	 * Parses a tag and creates a DocParam object
	 * @param tag The param tag
	 */
	private _createParam(tag: CommentParser.Tag): DocParam {
		const param = new DocParam();
		param.name = StringUtils.escapeHtml(tag.name);
		param.type = StringUtils.escapeHtml(tag.type);
		param.optional = tag.optional;
		let str = StringUtils.stripInitialHypen(tag.description);
		str = StringUtils.markdown2Html(str);
		str = StringUtils.compactHtmlSingleParagraph(str);
		param.description = str;
		return param;
	}

	/**
	 * Recreates the content of a splitted tag into a single string
	 * @param tag The tag to reconstruct
	 */
	private _reconstructTag(tag: CommentParser.Tag): string {
		// TODO: reconstruct tag from tag.source.
		const strArr = [];
		if (tag.type) {
			strArr.push(`{${tag.type}}`);
		}
		if (tag.name) {
			strArr.push((tag.optional) ? "[" + tag.name + "]" : tag.name);
		}
		if (tag.description) {
			strArr.push(tag.description);
		}
		return strArr.join(" ");
	}
}
