import DocFolder from "./DocFolder";
import { DocResourceType } from "./enums/DocResourceType";

/**
 * Represents any resource in the output documentation
 */
export default class DocResource {

	/**
	 * The name of the resource. Example "src_enemies" or "scripts" or "obj_control".
	 */
	public name: string = "";

	/**
	 * The type of resource
	 */
	public readonly type: DocResourceType = DocResourceType.Resource;

	/**
	 * The parent folder. For the base folder (for example the base "script" folder), this value is null
	 */
	public parent: DocFolder | null = null;

	/**
	 * Creates an instance of DocResource.
	 * @param {string} name The resource name
	 * @memberof DocResource
	 */
	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Returns the fullpath of the resource
	 */
	get fullpath(): string {
		return this.parent ? this.parent.fullpath +  this.name : this.name;
	}
}
