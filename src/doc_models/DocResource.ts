import DocFolder from "./DocFolder";

/**
 * Represents any resource in the output documentation
 */
export default abstract class DocResource {

	/**
	 * The name of the resource. Example "src_enemies" or "scripts" or "obj_control".
	 */
	public name: string = "";

	/**
	 * The type of resource
	 */
	public readonly abstract type: string = "resource";

	/**
	 * The parent folder
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
}
