import * as fse from "fs-extra";
import * as path from "path";

import { IGMScript } from "../GMInterfaces";
import * as GMS2Descriptor from "./GMS2Descriptor";
import GMProject from "./GMS2Project";
import GMS2Resource from "./GMS2Resource";

/**
 * Represents a GMS2 Script
 */
export default class GMS2Script extends GMS2Resource implements IGMScript {

	/**
	 * The script name
	 */
	public name: string;

	/**
	 * Is a compatibility script?
	 */
	public isCompatibility: boolean;

	/**
	 * The GML content
	 */
	private _text: string | undefined = undefined;

	/**
	 * Creates a new Script
	 * @param data The YOYO model data for the script
	 * @param project The base project for the script
	 */
	constructor(data: GMS2Descriptor.IScript, project: GMProject) {
		super(data, project);
		this.isCompatibility = data.IsCompatibility;
	}

	/**
	 * Loads the script content
	 */
	public async load() {
		let filePath;
		if (this.isCompatibility) {
			filePath = path.resolve(this.project.path, "scripts", "@" + this.name, this.name + ".gml");
		} else {
			filePath = path.resolve(this.project.path, "scripts", this.name, this.name + ".gml");
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
			throw new Error("Must call load() before accesing the subScripts() function");
		}
		// This lines converts the triple slash comments ( ///comment)
		// to JSDoc comments
		const str = this._text
			.replace(/\/\/\/ ?(.*)\n/g, "/**\n * $1 \n */\n")
			.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		yield [this.name, str];
	}

}
