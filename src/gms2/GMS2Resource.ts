import { IGMResource } from "../IGMInterfaces";
import ReporterManager from "../reporter/ReporterManager";
import GMS2Folder from "./GMS2Folder";
import GMS2Model from "./GMS2Model";
import * as IGMS2Descriptor from "./IGMS2Descriptor";
import IGMS2Project from "./IGMS2Project";

/**
 * Represents a Generic GMS2 Resource
 */
export default class GMS2Resource extends GMS2Model implements IGMResource {

	/**
	 * The parent folder of this resource
	 */
	public parent: GMS2Folder | null = null;

	/**
	 * The project of wich this resource belongs to
	 */
	public project: IGMS2Project;

	/**
	 * The resource name
	 */
	public name: string;

	/**
	 * Creates a new resource instance
	 * @param data The data to populate
	 * @param project The project which this resource belongs to
	 */
	constructor(data: IGMS2Descriptor.IResource, project: IGMS2Project) {
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
		ReporterManager.reporter.debug(`${sp}- ${this.name}`);
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
