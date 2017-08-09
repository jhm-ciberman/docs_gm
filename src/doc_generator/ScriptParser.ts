import parse = require("comment-parser");

import DocScript from "../docs_models/DocScript";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";

export default class ScriptParser {

    static parse(str:string, name:string):DocScript {
        var comments = parse(str);
        var script = new DocScript();
        script.name = name;
        for (var comment of comments) {
            script.description = comment.description;
            for (var tag of comment.tags) {
                this._parseTag(tag, script);
            }
        }
        return script;
    }

    private static _parseTag(tag:CommentParser.Tag, script:DocScript) {
        switch (tag.tag.toLowerCase()) {
            case "param":
            case "arg":
            case "argument":
                var param = new DocParam();
                param.name = tag.name;
                param.type = tag.type;
                param.optional = tag.optional;
                param.description = tag.description;
                script.params.push(param);
                break;
            case "description":
            case "desc":
                script.description = tag.description;
                break;
            case "returns":
            case "return":
                script.returns = script.returns || new DocReturns();
                script.returns.description = tag.description;
                script.returns.type = tag.type;
                break;
        }
    }
}
