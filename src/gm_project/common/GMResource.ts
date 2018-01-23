import IGMFolder from "../interfaces/IGMFolder";
import IGMResource from "../interfaces/IGMResource";

/**
 * Represents a generic GameMaker resource.
 */
export default class GMResource implements IGMResource {

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
	constructor(name: string) {
		this.name = name;
	}

	/**
	 * The full path of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "") + this.name;
	}
}
