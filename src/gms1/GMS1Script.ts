import * as path from "path";
import * as fse from "fs-extra";

import GMS1Resource from "./GMS1Resource";
import GMS1Project from "./GMS1Project";
import GMS1Folder from "./GMS1Folder";
import { GMScript } from "../GMInterfaces";
import DocsGM from "../DocsGM";

/**
 * Represents a GMS1 Script. Can contain subscripts. 
 */
export default class GMS1Script extends GMS1Resource implements GMScript {

    private _path: string;

    private _subScripts: Map<string, string> = new Map();

    /**
     * Creates a new GMS1 script
     * @param file The filename of the script
     * @param project The GMS1 Project of this script
     * @param parent The parent folder
     */
    constructor(file: string, project: GMS1Project, parent: GMS1Folder) {
        super(project, parent, path.basename(file).split(".")[0]);
        this._path = file;
        this.project.addResource(this, "script");
    }

    /**
     * Loads and parses the script with subscripts
     * @returns A promise
     */
    public async load(): Promise<this> {
        if (this._subScripts.size > 0) {
            return this;
        }
        const pathStr = path.resolve(this.project.path, this._path);
        let str = await fse.readFile(pathStr, 'utf8');
        // Normalize new lines (to use the next regex)
        str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        this._subScripts.set(this.name, str);

        // This regex captures the script name in the capture group 1, and
        // the content of the script in the capture group 2.
        const regex = /#define (.*)\n((?:.|\n)*?)(?=#define |$)/g;
        let m;
        while ((m = regex.exec(str)) !== null) {            
            this._subScripts.set(m[1], m[2]);
        }

        return this;
    }

	/**
	 * Returns an iterable with a pair of [name, text] for each 
	 * subscript in this script object
	 */
    public * subScripts():IterableIterator<[string, string]> {
        if (!this._subScripts.has(this.name)) {
            throw "Must call load() before accesing the subScripts() function";
        }
        for (var [name, content] of this._subScripts.entries()) {
            // This lines converts the triple slash comments ( ///comment)
            // to a @function JSDoc comments
            content = content.replace(/\/\/\/ ?(.*)\n/g, "/**\n * @function $1 \n */\n");
            yield [name, content];
        }
    }

    /**
     * Print itself to the console for debug purposes
     * @param spaces The number of spaces to use
     */
    public print(spaces: number = 0) {
        var sp = "  ".repeat(spaces);
        if (this._subScripts.size > 1) {
            DocsGM.console.debug(`${sp}- ${this.name} [${this._subScripts.size} subscripts]`);
        } else {
            DocsGM.console.debug(`${sp}- ${this.name}`);
        }

    }

}
