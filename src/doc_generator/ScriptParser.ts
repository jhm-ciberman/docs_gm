import parse = require("comment-parser");
import * as showdown from "showdown";

import DocScript from "../docs_models/DocScript";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";
import DocExample from "../docs_models/DocExample";
import OutputConfig from "./OutputConfig";
import { GMScript } from "../GMInterfaces";
import DocsGM from "../DocsGM";


type GMLFeatures = {
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

export default class ScriptParser {

    private _markdown: showdown.Converter;

    private _config: OutputConfig;

    private _removeCommentsRegex: RegExp = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

    private _removeStringsRegex: RegExp = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/;

    private _findFixedArgumentsRegex: RegExp = /[\s{(]argument([0-9]+)[\s;})]/g;

    private _findArrayArgumentsRegex: RegExp = /[\s{(]argument\[([0-9]+)\][\s;})]/g;

    private _findReturnRegex: RegExp = /[\s{(;]return[\s;})]/;

    /**
     * Creates a ScriptParser instance
     */
    public constructor(config: OutputConfig) {
        this._markdown = new showdown.Converter({
            simplifiedAutoLink: true,
            literalMidWordUnderscores: true,
            literalMidWordAsterisks: true,
            tables: true,
            openLinksInNewWindow: true,
            omitExtraWLInCodeBlocks: true,
            noHeaderId: true
        } as showdown.ConverterOptions);

        this._config = config;
    }

    /**
     * Parses a GMScript 
     * @param script An array with DocScript objects
     */
    public parseScript(script: GMScript): DocScript[] {
        var arr = [];
        for (var [name, text] of script.subScripts()) {
            var docScript = this._extractDocumentation(name, text);

            if (this._config.markUnderscoreScriptsAsPrivate && name.charAt(0) === "_") {
                docScript.private = true;
            }
            if (docScript.private && this._config.ignorePrivateScripts) {
                continue;
            }
            if (docScript.undocumented) {
                if (this._config.warnUndocumentedScripts) {
                    DocsGM.console.warn(`Script "${name}" is undocumented.`);
                }
                if (this._config.ignoreUndocumentedScripts) {
                    continue;
                }
            }
            if (!docScript.description) {
                if (this._config.warnNoDescriptionScripts) {
                    DocsGM.console.warn(`Script "${name}" has no description.`);
                }
                if (this._config.ignoreNoDescriptionScripts) {
                    continue;
                }
            }

            var features = this._extractGMLFeatures(text);
            var docsN = docScript.params.length;
            var argsN = features.argumentCount;
            if (docsN == 0) {
                if (this._config.warnUndocumentedArgumentsScripts) {
                    DocsGM.console.warn(`Script "${name}" uses arguments but does not have any @param JSDoc comment.`);
                }
                if (this._config.ignoreUndocumentedArgumentsScripts) {
                    continue;
                }
            }
            if (argsN !== docsN) {
                if (this._config.warnMismatchingArgumentsScripts) {
                    DocsGM.console.warn(`Script "${name}" uses ${argsN} but has documentation for ${docsN} arguments.`);
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

        var comments = parse(text);

        var script = new DocScript();
        script.name = name;

        for (var comment of comments) {
            if (comment.description) {
                script.undocumented = false;
                script.description = this._makeHtml(comment.description);
            }
            for (var tag of comment.tags) {
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
    private _extractGMLFeatures(text: string): GMLFeatures {
        // Removes single and multiline comments.
        // See: https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
        text = text.replace(this._removeCommentsRegex, '$1');

        // Removes strings (Double and single quoted strings)
        // https://stackoverflow.com/a/17231632/2022985
        text = text.replace(this._removeStringsRegex, '');

        var data: GMLFeatures = {
            argumentCount: 0,
            optionalArguments: false,
            hasReturn: false
        }

        var result: RegExpExecArray | null;
        // Match: argument0, argument1, argument2... etc.
        while (result = this._findFixedArgumentsRegex.exec(text)) {
            data.argumentCount = Math.max(data.argumentCount, parseInt(result[1]) + 1);
        }

        // March argument[0], argument[1], argument[2]... etc
        while (result = this._findArrayArgumentsRegex.exec(text)) {
            data.argumentCount = Math.max(data.argumentCount, parseInt(result[1]) + 1);
            data.optionalArguments = true;
        }

        //Match return statements
        data.hasReturn = (text.match(this._findReturnRegex) !== null)

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
                var param = new DocParam();
                param.name = this._escapeHtml(tag.name);
                param.type = this._escapeHtml(tag.type);
                param.optional = tag.optional;
                var str = this._stripInitialSlash(tag.description);
                str = this._makeHtml(str);
                str = this._compactHtmlSingleParagraph(str);
                param.description = str;
                script.params.push(param);
                script.undocumented = false;
                break;
            case "description":
            case "desc":
            case "private": // Private works in the same way as a description
                var text = this._reconstructTag(tag);
                script.description = this._makeHtml(text);
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
                var example = new DocExample();
                var str = this._reconstructTag(tag);
                str = this._stripInitialLineFeeds(str);
                example.code = this._escapeHtml(str);
                script.examples.push(example);
                script.undocumented = false;
                break;
            case "function":
            case "func":
            case "method":
                var name = this._reconstructTag(tag);
                if (name != script.name && this._config.warnMismatchingFunctionName) {
                    DocsGM.console.warn(`Script "${script.name}" has a mismatching @function name "${name}"`);
                }
                break;
            default:
                if (this._config.warnUnrecognizedTags) {
                    DocsGM.console.warn(`Unrecognized tag "${tag.tag.toLowerCase()}" at script "${script.name}"`);
                }
                return false;
        }
        return false;
    }

    //TODO: reconstruct tag from tag.source.
    private _reconstructTag(tag: CommentParser.Tag): string {
        var strArr = [];
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

    /**
     * Converts the passed markup text to HTML
     * @param markupText The Markup Text to convert
     * @return The HTML string
     */
    private _makeHtml(markupText: string): string {
        return this._markdown.makeHtml(markupText);
    }


    /**
     * Escapes the passed HTML string
     * @param str The string
     * @return The output string
     */
    private _escapeHtml(str: string): string {
        // Source: https://github.com/mozilla/nunjucks/blob/f1edabf48fc9acae38972cb19497b1072e901965/src/lib.js
        const escapeMap: any = {
            '&': '&amp;',
            '"': '&quot;',
            '\'': '&#39;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return str.replace(/[&"'<>]/g, (ch: string) => {
            return escapeMap[ch] as string;
        });
    }

    /**
     * Strips the initial slash
     * Example: "- Hello" turns into "Hello"
     * @param str The string
     * @return The output string
     */
    private _stripInitialSlash(str: string): string {
        return str.replace(/^- /, "");
    }

    /**
     * Strips the initial Line Feeds
     * Example: "\n\nHi\n" turns into "Hi\n"
     * @param str The string
     * @return The output string
     */
    private _stripInitialLineFeeds(str: string): string {
        return str.replace(/^\n*/, "");
    }

    /**
     * Removes the <p> elements in single paragraphs.
     * Example:
     * "<p>Hi</p>" is turned in "Hi"
     * But "<p>Foo</p><p>bar</p>" is preserved as is.
     * @param str The string
     * @return The output string
     */
    private _compactHtmlSingleParagraph(str: string): string {
        var m = /<p>([\s\S]*?)<\/p>/g.exec(str);
        return (m && m.length == 2) ? m[1] : str;
    }
}
