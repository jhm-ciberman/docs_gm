import GMScript from "../common/GMScript";

/**
 * Represents a GMS2 Script
 */
export default class GMS2Script extends GMScript {

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
	 * @param data The yoyo model data for the script
	 */
	constructor(name: string) {
		super(name);
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
			throw new Error("Must call loadFromString() before accessing the subScripts() function");
		}

		// This lines converts the triple slash comments ( ///comment) to JSDoc comments
		let str = this._text.replace(/^\/{3}(?!\/) *(.*)$/gm, "/**\n * $1\n */\n");

		// This regex combines multiple triple JSDoc comments into one.
		str = str.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		yield [this.name, str];
	}

}
