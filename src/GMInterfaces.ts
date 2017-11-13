
export interface GMProject {
    path: string;
    load(): Promise<this>;
    print(spaces?: number): void;
    find(pattern: string, type?: string): GMResource[];
    addResource(resource: GMResource, type: string): void;
}

export interface GMProjectStatic {
    /**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
    loadProject(file: string): Promise<GMProject>
}

export interface GMResource {
    project: GMProject;
    parent: GMFolder | null;
    fullpath: string;
    name: string;
    print(spaces?: number): void;
    load(): Promise<this>;
}

export interface GMFolder extends GMResource {

}

export interface GMScript extends GMResource {
    /**
     * Returns an iterator with the name and text of each subscript in this script
     */
    subScripts(): IterableIterator<[string, string]>;
}
