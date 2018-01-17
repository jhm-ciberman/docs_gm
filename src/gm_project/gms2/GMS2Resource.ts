import IGMFolder from "../interfaces/IGMFolder";
import IGMResource from "../interfaces/IGMResource";
import * as IGMS2Descriptor from "./IGMS2Descriptor";

/**
 * Represents a Generic GMS2 Resource
 */
export default class GMS2Resource implements IGMResource {

	/**
	 * The parent folder of this resource
	 */
	public parent: IGMFolder | null = null;

	/**
	 * The resource name
	 */
	public name: string;

	/**
	 * The ID of the YoYo Model
	 */
	public id: string;

	/**
	 * Creates a new resource instance
	 * @param data The data to populate
	 * @param project The project which this resource belongs to
	 */
	constructor(data: IGMS2Descriptor.IResource) {
		this.id = data.id;
		this.name = data.name;
	}

	/**
	 * gets the fullpath of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "") + this.name;
	}

}
