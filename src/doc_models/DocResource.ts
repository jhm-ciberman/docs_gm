import DocFolder from "./DocFolder";
import { DocElementType } from "./enums/DocElementType";
import IDocElement from "./interfaces/IDocElement";

/**
 * Represents any resource in the output documentation
 */
export default abstract class DocResource implements IDocElement {

	/**
	 * The name of the resource. Example "src_enemies" or "scripts" or "obj_control".
	 */
	public name: string = "";

	/**
	 * The type of resource
	 */
	public readonly abstract type: DocElementType = DocElementType.Resource;

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
}
