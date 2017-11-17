import DocsGM from "../DocsGM";
import { IGMResource } from "../GMInterfaces";
import * as GMS2Descriptor from "./GMS2Descriptor";
import GMFolder from "./GMS2Folder";
import GMModel from "./GMS2Model";
import GMProject from "./GMS2Project";

/**
 * Represents a Generic GMS2 Resource
 */
export default class GMS2Resource extends GMModel implements IGMResource {

	/**
	 * The parent folder of this resource
	 */
	public parent: GMFolder | null = null;

	/**
	 * The project of wich this resource belongs to
	 */
	public project: GMProject;

	/**
	 * The resource name
	 */
	public name: string;

	/**
	 * The resource id
	 */
	public id: string = "";

	/**
	 * Creates a new resource instance
	 * @param data The data to populate
	 * @param project The project which this resource belongs to
	 */
	constructor(data: GMS2Descriptor.IResource, project: GMProject) {
		super(data);
		this.project = project;
		this.name = data.name;
	}

	/**
	 * Prints itself for easy debug
	 * @param spaces the number of spaces
	 */
	public print(spaces: number = 0) {
		const sp = "  ".repeat(spaces);
		DocsGM.console.debug(`${sp}- ${this.name}`);
	}

	/**
	 * gets the fullpath of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "") + this.name;
	}

	/**
	 * Loads the resource
	 */
	public async load() {
		return this;
	}
}
