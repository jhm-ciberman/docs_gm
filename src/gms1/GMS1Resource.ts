import DocsGM from "../DocsGM";
import GMS1Folder from "./GMS1Folder";
import GMS1Project from "./GMS1Project";

/**
 * Represents a generic GMS1 resource.
 */
export default class GMS1Resource {

	/**
	 * The base project for the resource
	 */
	public project: GMS1Project;

	/**
	 * The parent folder of the resource
	 */
	public parent: GMS1Folder | null;

	/**
	 * The resource name
	 */
	public name: string;

	/**
	 * Creates a new Resource
	 * @param project The GMS1 Project
	 * @param parent The Parent folder of the resource
	 * @param name The name of the resource
	 */
	constructor(project: GMS1Project, parent: GMS1Folder | null, name: string) {
		this.project = project;
		this.parent = parent;
		this.name = name;
	}

	/**
	 * Loads the resource in memory
	 * @returns A promise
	 */
	public async load(): Promise<this> {
		// empty! :D (see subclasses)
		return this;
	}

	/**
	 * The full path of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "") + this.name;
	}

	/**
	 * Print itself to the console for debug purposes
	 * @param spaces The number of spaces to use
	 */
	public print(spaces: number = 0) {
		const sp = "  ".repeat(spaces);
		DocsGM.console.debug(`${sp}- ${this.name}`);
	}
}
