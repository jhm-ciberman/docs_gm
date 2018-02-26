import * as path from "path";

import GMScript from "../common/GMScript";

/**
 * Represents a GMS1 Script. Can contain subscripts.
 */
export default class GMS1Script extends GMScript {

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
	 * This regex captures the script name in the capture group 1, and
	 * the content of the script in the capture group 2.
	 */
	private _captureSubscriptsRegex = /#define (.*)\n((?:.|\n)*?)(?=\n?#define |$)/g;

	/**
	 * Creates a new GMS1 script
	 * @param file The relative filename of the script
	 */
	constructor(file: string) {
		super(path.basename(file).split(".")[0]);
		this._path = file;
	}

	/**
	 * Loads and parses the script with subscripts
	 * from a string.
	 * @param str The content of the *.gml file
	 * @returns A promise
	 */
	public async loadFromString(str: string): Promise<this> {
		this._subScripts.clear();
		// Normalize new lines (to use the next regex)
		str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

		let m = this._captureSubscriptsRegex.exec(str);
		if (m === null) {
			this._subScripts.set(this.name, str);
		} else {
			while (m) {
				this._subScripts.set(m[1], m[2]);
				m = this._captureSubscriptsRegex.exec(str);
			}
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
		if (this._subScripts.size === 0) {
			throw new Error("Must call loadFromString() before accesing the subScripts() function");
		}
		for (let [name, content] of this._subScripts.entries()) {
			// This lines converts the triple slash comments ( ///comment)
			// to a @function JSDoc comments
			content = content.replace(/\/\/\/ ?(.*)\n/g, "/**\n * @function $1 \n */\n");
			yield [name, content];
		}
	}

}
