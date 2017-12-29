/**
 * @fileOverview This file contains interfaces 
 * common to GMS1 and GMS2 project and resources classes.
 */

export interface IGMProject {
	readonly path: string;
	readonly name: string;
	find(pattern: string): IGMResource[];
}

export interface IGMResource {
	parent: IGMFolder | null;
	fullpath: string;
	name: string;
}

export interface IGMFolder extends IGMResource {
	readonly children: IGMResource[];
}

export interface IGMScript extends IGMResource {
	/**
	 * The file location of the GML file
	 */
	readonly filepath: string;
	/**
	 * Returns an iterator with the <[name, text]> of each SubScript in this script
	 */
	subScripts(): IterableIterator<[string, string]>;

	/**
	 * Loads the script (and posible subscripts) from a string with the content of the file
	 * @param str The content of the *.gml file
	 * @returns A promise
	 */
	loadFromString(str: string): void;
}
