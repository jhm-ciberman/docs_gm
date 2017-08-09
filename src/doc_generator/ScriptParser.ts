import parse = require("comment-parser");
import * as showdown from "showdown";

import DocScript from "../docs_models/DocScript";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";
import DocExample from "../docs_models/DocExample";

export default class ScriptParser {

    private static _markdown = new showdown.Converter({
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        literalMidWordAsterisks: true,
        tables:true,
        openLinksInNewWindow: true,
        omitExtraWLInCodeBlocks: true,
        noHeaderId: true
    } as showdown.ConverterOptions);



    static parse(str:string, name:string):DocScript|null {
        var comments = parse(str);
        var script = new DocScript();
        script.name = name;
        var noContent = true;
        for (var comment of comments) {
            if (comment.description) {
                noContent = false;
                script.description = this._makeHtml(comment.description);
            }
            for (var tag of comment.tags) {
                var parsed = this._parseTag(tag, script);
                if (parsed && noContent) {
                    noContent = false;
                }
            }
        }
        if (noContent) {
            console.log(`> WARNING: Script "${script.name}" has no documentation.`);
            return null;
        }
        return script;
    }

    /**
     * @returns true if some data could be extracted from the tag
     */
    private static _parseTag(tag:CommentParser.Tag, script:DocScript):boolean {
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
                return true;
            case "description":
            case "desc":
                var text = this._reconstructTag(tag);
                script.description = this._makeHtml(text);
                return true;
            case "returns":
            case "return":
                script.returns = script.returns || new DocReturns();
                script.returns.description = tag.description;
                script.returns.type = tag.type;
                return true;
            case "example":
                var example = new DocExample();
                var str = this._reconstructTag(tag);
                str = this._stripInitialLineFeeds(str);
                example.code = this._escapeHtml(str);
                script.examples.push(example);
                return true;
        }
        return false;
    }

    //TODO: reconstruct tag from tag.source.
    private static _reconstructTag(tag:CommentParser.Tag):string {
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

    private static _makeHtml(text:string):string {
        return this._markdown.makeHtml(text);
    }

    
    private static _escapeHtml(str:string):string {
        // Source: https://github.com/mozilla/nunjucks/blob/f1edabf48fc9acae38972cb19497b1072e901965/src/lib.js
        const escapeMap:any = {
            '&': '&amp;',
            '"': '&quot;',
            '\'': '&#39;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return str.replace(/[&"'<>]/g, (ch:string) => {
            return escapeMap[ch] as string;
        });
    }

    /**
     * Strips the initial slash
     * Example: "- Hello" turns into "Hello"
     */
    private static _stripInitialSlash(str:string):string {
        return str.replace(/^- /, "");
    }

    /**
     * Strips the initial Line Feeds
     * Example: "\n\nHi\n" turns into "Hi\n"
     */
    private static _stripInitialLineFeeds(str:string):string {
        return str.replace(/^\n*/, "");
    }

    /**
     * Removes the <p> elements in single paragraphs.
     * Example:
     * "<p>Hi</p>" is turned in "Hi"
     * But "<p>Foo</p><p>bar</p>" is preserved as is.
     */
    private static _compactHtmlSingleParagraph(str:string):string {
        var m = /<p>([\s\S]*?)<\/p>/g.exec(str);
        return (m && m.length == 2) ? m[1] : str;
    }
}
