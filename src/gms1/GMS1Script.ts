import * as path from "path";
import * as fse from "fs-extra";

import GMS1Resource from "./GMS1Resource";
import GMS1Project from "./GMS1Project";
import GMS1Folder from "./GMS1Folder";
import ScriptParser from "../doc_generator/ScriptParser";
import DocScript from "../docs_models/DocScript";
import { GMScript } from "../GMInterfaces";

export default class GMS1Script extends GMS1Resource implements GMScript {

    private _path: string;
    private subScripts: Map<string, string> = new Map();
    constructor(file: string, project: GMS1Project, parent: GMS1Folder) {
        super(project, parent, path.basename(file).split(".")[0]);
        this._path = file;
        this.project.addResource(this, "script");
    }

    public async load() {
        if (this.subScripts.size > 0) {
            return this;
        }
        const pathStr = path.resolve(this.project.path, this._path);
        let str = await fse.readFile(pathStr, 'utf8');
        // Normalize new lines (to use the next regex)
        str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        this.subScripts.set(this.name, str);

        // This regex captures the script name in the capture group 1, and
        // the content of the script in the capture group 2.
        const regex = /#define (.*)\n((?:.|\n)*?)(?=#define |$)/g;
        let m;
        while ((m = regex.exec(str)) !== null) {
            this.subScripts.set(m[1], m[2]);
        }

        return this;
    }

    public parse():DocScript[] {
        if (!this.subScripts.has(this.name)) {
            throw "Please call first loadGML() before parse the current GMScript";
        }
        var result:DocScript[] = [];
        for (var [name, content] of this.subScripts.entries()) {
            // This lines converts the triple slash comments ( ///comment)
    		// to a @function JSDoc comments
    		var str = content
    			.replace(/\/\/\/ ?(.*)\n/g, "/**\n * @function $1 \n */\n")
    			//.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

            var script = ScriptParser.parse(str, name);
            if (script) {
                result.push(script);
            }

        }
        return result;
    }

    public print(spaces:number = 0) {
        var sp = "  ".repeat(spaces);
        if (this.subScripts.size > 1) {
            console.log(`${sp}- ${this.name} [${this.subScripts.size} subscripts]`);
        } else {
            console.log(`${sp}- ${this.name}`);
        }

    }

}
