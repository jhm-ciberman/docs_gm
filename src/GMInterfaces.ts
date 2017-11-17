
export interface IGMProject {
	path: string;
	name: string;
	load(): Promise<this>;
	print(spaces?: number): void;
	find(pattern: string, type?: string): IGMResource[];
	addResource(resource: IGMResource, type: string): void;
}

export interface IGMProjectStatic {
	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	loadProject(file: string): Promise<IGMProject>;
}

export interface IGMResource {
	project: IGMProject;
	parent: IGMFolder | null;
	fullpath: string;
	name: string;
	print(spaces?: number): void;
	load(): Promise<this>;
}

export interface IGMFolder extends IGMResource {
	children: IGMResource[];
}

export interface IGMScript extends IGMResource {
	/**
	 * Returns an iterator with the name and text of each subscript in this script
	 */
	subScripts(): IterableIterator<[string, string]>;
}
