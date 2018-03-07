import GMResource from "../GMResource";
import GMSubscript from "../GMSubscript";
import IGMScript from "../interfaces/IGMScript";

/**
 * Represents a GMS2 Script
 */
export default class GMS2Script extends GMResource implements IGMScript {

	/**
	 * Is a compatibility script?
	 */
	public readonly isCompatibility: boolean;

	/**
	 * Creates a new Script
	 * @param data The yoyo model data for the script
	 */
	constructor(name: string, isCompatibility: boolean) {
		super(name);
		this.isCompatibility = isCompatibility;
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
	 * Returns an iterable with a GMSubscript for each subscript in this script object
	 * @param gmlText The content of the *.gml file.
	 */
	public * subScripts(gmlText: string): IterableIterator<GMSubscript> {
		// This lines converts the triple slash comments ( ///comment) to JSDoc comments
		let str = gmlText.replace(/^\/{3}(?!\/) *(.*)$/gm, "/**\n * $1\n */\n");

		// This regex combines multiple triple JSDoc comments into one.
		str = str.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		yield new GMSubscript(this.name, str);
	}

}
