import * as path from "path";

import GMResource from "../GMResource";
import GMSubscript from "../GMSubscript";
import IGMScript from "../interfaces/IGMScript";

/**
 * Represents a GMS1 Script. Can contain subscripts.
 */
export default class GMS1Script extends GMResource implements IGMScript {

	/**
	 * The filename of the script
	 */
	public readonly filepath: string;

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
		this.filepath = file.replace("\\", "/");
	}

	/**
	 * Returns an iterable with a pair of [name, text] for each
	 * subscript in this script object
	 */
	public * subScripts(gmlText: string): IterableIterator<GMSubscript> {

		for (let [name, content] of this._parseSubscripts(gmlText).entries()) {
			// This lines converts the triple slash comments ( ///comment)
			// to a @function JSDoc comments
			content = content.replace(/\/\/\/ ?(.*)\n/g, "/**\n * @function $1 \n */\n");
			yield new GMSubscript(name, content);
		}
	}

	/**
	 * Parses the gml file contents and returns a map were each key is the name of
	 * one subscript and each value is the gml content of that subscript
	 * @private
	 * @returns {Map<string, string>}
	 * @memberof GMS1Script
	 */
	private _parseSubscripts(gmlText: string): Map<string, string> {
		// Key: subscript name, value: gmlText of the subscript
		const subScripts: Map<string, string> = new Map();
		// Normalize new lines (to use the next regex)
		gmlText = gmlText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		let m = this._captureSubscriptsRegex.exec(gmlText);
		if (m === null) {
			subScripts.set(this.name, gmlText);
		} else {
			while (m) {
				subScripts.set(m[1], m[2]);
				m = this._captureSubscriptsRegex.exec(gmlText);
			}
		}
		return subScripts;
	}

}
