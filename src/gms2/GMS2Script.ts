import { IGMScript } from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";
import * as GMS2Descriptor from "./IGMS2Descriptor";

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
	private _text: string | null = null;

	/**
	 * Creates a new Script
	 * @param data The YOYO model data for the script
	 */
	constructor(data: GMS2Descriptor.IScript) {
		super(data);
		this.isCompatibility = data.IsCompatibility || false;
	}

	/**
	 * Load the script fom a string
	 * @param str The *.gml file contents
	 */
	public loadFromString(str: string) {
		this._text = str;
	}

	/**
	 * relative path of the GML file
	 */
	public get filepath(): string {
		return "scripts/"
			+ (this.isCompatibility ? "@" : "") + this.name + "/"
			+ this.name + ".gml";
	}

	/**
	 * Returns an iterable with a pair of [name, text] for each
	 * subscript in this script object
	 */
	public * subScripts(): IterableIterator<[string, string]> {
		if (this._text === null) {
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
