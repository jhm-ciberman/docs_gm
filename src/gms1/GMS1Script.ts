import * as path from "path";
import { IGMScript } from "../IGMInterfaces";
import GMS1Folder from "./GMS1Folder";
import GMS1Resource from "./GMS1Resource";

/**
 * Represents a GMS1 Script. Can contain subscripts.
 */
export default class GMS1Script extends GMS1Resource implements IGMScript {

	/**
	 * The filename of the script
	 */
	private _path: string;

	/**
	 * A map with each subscript.
	 * Key: subscript name.
	 * value: gml of the subscript
	 */
	private _subScripts: Map<string, string> = new Map();

	/**
	 * Creates a new GMS1 script
	 * @param file The relative filename of the script
	 * @param project The GMS1 Project of this script
	 * @param parent The parent folder
	 */
	constructor(file: string, parent: GMS1Folder) {
		super(parent, path.basename(file).split(".")[0]);
		this._path = file;
	}

	/**
	 * Loads and parses the script with subscripts
	 * from a string.
	 * @param str The content of the *.gml file
	 * @returns A promise
	 */
	public async loadFromString(str: string): Promise<this> {
		// Normalize new lines (to use the next regex)
		str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		this._subScripts.set(this.name, str);

		// This regex captures the script name in the capture group 1, and
		// the content of the script in the capture group 2.
		const regex = /#define (.*)\n((?:.|\n)*?)(?=#define |$)/g;

		let m = regex.exec(str);
		while (m) {
			this._subScripts.set(m[1], m[2]);
			m = regex.exec(str);
		}

		return this;
	}

	/**
	 * The relative file path of the *.gml file.
	 */
	get filepath(): string {
		return this._path;
	}

	/**
	 * Returns an iterable with a pair of [name, text] for each
	 * subscript in this script object
	 */
	public * subScripts(): IterableIterator<[string, string]> {
		if (!this._subScripts.has(this.name)) {
			throw new Error("Must call load() before accesing the subScripts() function");
		}
		for (let [name, content] of this._subScripts.entries()) {
			// This lines converts the triple slash comments ( ///comment)
			// to a @function JSDoc comments
			content = content.replace(/\/\/\/ ?(.*)\n/g, "/**\n * @function $1 \n */\n");
			yield [name, content];
		}
	}

}
