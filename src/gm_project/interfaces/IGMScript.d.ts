import IGMResource from "./IGMResource";

export default interface IGMScript extends IGMResource {
	/**
	 * The file location of the GML file
	 */
	readonly filepath: string;

	/**
	 * Returns an iterator with the <[name, text]> of each SubScript in this script
	 */
	subScripts(): IterableIterator<[string, string]>;
	
	/**
	 * Loads the script (and possible subscripts) from a string with the content of the file
	 * @param str The content of the *.gml file
	 * @returns A promise
	 */
	loadFromString(str: string): void;
}
