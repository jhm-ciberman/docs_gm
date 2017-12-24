
export enum ResourceType {
	Unknown,
	Script,
	Folder,
}

export interface IGMProject {
	path: string;
	name: string;
	find(pattern: string, type?: ResourceType): IGMResource[];
	load(): Promise<this>;
	addResource(resource: IGMResource, type: ResourceType): void;
}

export interface IGMResource {
	parent: IGMFolder | null;
	fullpath: string;
	name: string;
}

export interface IGMFolder extends IGMResource {
	children: IGMResource[];
}

export interface IGMScript extends IGMResource {
	/**
	 * The relative file path of the *.gml file.
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
