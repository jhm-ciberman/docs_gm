import GMResource from "./GMResource";

/**
 * Represents a GameMaker Script
 */
export default abstract class GMScript extends GMResource {

	/**
	 * The file location of the GML file
	 */
	public abstract readonly filepath: string;

	/**
	 * Creates an instance of the abstract class GMScript.
	 * @param {string} name The script name
	 * @memberof GMScript
	 */
	constructor(name: string) {
		super(name);
	}

	/**
	 * Returns an iterator with the <[name, text]> of each SubScript in this script
	 */
	public abstract subScripts(): IterableIterator<[string, string]>;

	/**
	 * Loads the script (and possible subscripts) from a string with the content of the file
	 * @param str The content of the *.gml file
	 * @returns A promise
	 */
	public abstract loadFromString(str: string): void;
}
