import {IGMFolder, IGMResource} from "../IGMInterfaces";
import GMS1Folder from "./GMS1Folder";

/**
 * Represents a generic GMS1 resource.
 */
export default class GMS1Resource implements IGMResource {

	/**
	 * The parent folder of the resource
	 */
	public parent: IGMFolder | null;

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
	constructor(parent: GMS1Folder | null, name: string) {
		this.parent = parent;
		this.name = name;
	}

	/**
	 * The full path of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "") + this.name;
	}
}
