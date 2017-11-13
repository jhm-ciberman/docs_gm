import * as path from "path";
import * as fse from "fs-extra";

import GMS2Resource from "./GMS2Resource";
import GMProject from "./GMS2Project";
import { GMScript } from "../GMInterfaces";

export default class GMS2Script extends GMS2Resource implements GMScript {

	/**
	 * The script name
	 */
	public name: string;

	/**
	 * Is a compatibility script?
	 */
	public isCompatibility: boolean;

	private _text: string | undefined = undefined;

	/**
	 * Creates a new Script
	 * @param data The YOYO model data for the script
	 * @param project The base project for the script
	 */
	constructor(data: GMS2ScriptData, project: GMProject) {
		super(data, project);
		this.isCompatibility = data.IsCompatibility;
	}

	/**
	 * Loads the script content
	 */
	public async load() {
		if (this.isCompatibility) {
			var filePath = path.resolve(this.project.path, "scripts", "@" + this.name, this.name + ".gml");
		} else {
			var filePath = path.resolve(this.project.path, "scripts", this.name, this.name + ".gml");
		}

		this._text = await fse.readFile(filePath, "utf8");

		return this;
	}

	/**
	 * Returns an iterable with a pair of [name, text] for each 
	 * subscript in this script object
	 */
	public * subScripts(): IterableIterator<[string, string]> {
		if (!this._text) {
			throw "Must call load() before accesing the subScripts() function";
		}
		// This lines converts the triple slash comments ( ///comment)
		// to JSDoc comments
		var str = this._text
			.replace(/\/\/\/ ?(.*)\n/g, "/**\n * $1 \n */\n")
			.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		yield [this.name, str];
	}

};
