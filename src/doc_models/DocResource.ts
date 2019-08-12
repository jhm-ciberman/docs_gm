import DocFolder from "./DocFolder";
import DocProject from "./DocProject";
import { DocResourceType } from "./DocResourceType";

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
	 * The project of this resource
	 */
	public project: DocProject | null = null;

	/**
	 * Creates an instance of DocResource.
	 * @param {string} name The resource name
	 * @memberof DocResource
	 */
	constructor(name: string, docProject?: DocProject) {
		this.name = name;
		this.project = docProject || null;
	}

	/**
	 * Returns the fullpath of the resource
	 */
	get fullpath(): string {
		return this.parent ? this.parent.fullpath +  this.name : this.name;
	}
}
