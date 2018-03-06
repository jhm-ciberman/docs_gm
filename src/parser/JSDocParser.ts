import parse = require("comment-parser");
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import DocScript from "../doc_models/DocScript";
import IReporter from "../reporter/interfaces/IReporter";
import DocScriptFactory from "./DocScriptFactory";
import IJSDocParser from "./interfaces/IJSDocParser";

/**
 * Class for parsing the GML scripts and JSDocs comments inside those scripts
 */
@injectable()
export default class JSDocParser implements IJSDocParser {

	/**
	 * Should warn about unrecognized JSDoc tags?
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * The reporter to use
	 */
	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	/**
	 * Parses a gml script string and extracts all the documentation for a passed script
	 * and returns a new DocScript object.
	 * @param name The script name
	 * @param text The script content
	 * @returns A new DocScript object
	 */
	public parse(name: string, text: string): DocScript {

		const comments = parse(text);

		const factory = new DocScriptFactory(name);

		for (const comment of comments) {
			if (comment.description) {
				factory.setDescription(comment.description);
			}
			for (const tag of comment.tags) {
				this._parseTag(factory, tag, name);
			}
		}

		return factory.make();
	}

	/**
	 * Parse a single tag and add the tag to the DocScriptFactory
	 * @param factory The factory to add the tag to
	 * @param tag The tag to add
	 * @param name The name of the script to add the tag to
	 */
	private _parseTag(factory: DocScriptFactory, tag: CommentParser.Tag, name: string) {
		switch (tag.tag.toLowerCase()) {
			case "param":
			case "arg":
			case "argument":
				factory.addParam(tag.name, tag.type, tag.optional, tag.description);
				break;
			case "description":
			case "desc":
				factory.setDescription(this._reconstructTag(tag));
				break;
			case "private":
				factory.setDescription(this._reconstructTag(tag));
				factory.markPrivate();
				break;
			case "returns":
			case "return":
				factory.setReturns(tag.type, [tag.name, tag.description].join(" "));
				break;
			case "example":
				factory.addExample(this._reconstructTag(tag));
				break;
			case "function":
			case "func":
			case "method":
				factory.setFunction(this._parseFunction(this._reconstructTag(tag)));
				break;
			default:
				if (this.warnUnrecognizedTags) {
					this._reporter.warn(`Unrecognized tag "${ tag.tag.toLowerCase() }" at script "${ name }"`);
				}
		}
	}

	/**
	 * Given a function tag like "my_function(a,b,c)" produces "my_function"
	 * @param str The original function tag string
	 */
	private _parseFunction(str: string): string {
		const r = /^(.*)\(/.exec(str);
		return (r && r.length > 0) ? r[1] : str;
	}

	/**
	 * Recreates the content of a splitted tag into a single string.
	 * For example, in a description tag, if you start your description
	 * with {} or with [], then the CommentParser will treat those brackets
	 * like an optional argument. This script, recreates the original description
	 * tag.
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
