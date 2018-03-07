import DocFolder from "./DocFolder";
import { ISerializedResource } from "./interfaces/interfaces";
import ISerializable from "./interfaces/ISerializable";

/**
 * Represents any resource in the output documentation
 */
export default abstract class DocResource implements ISerializable<ISerializedResource> {

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

	public serialize(): ISerializedResource {
		return {
			name: this.name,
			type: this.type,
			parent: this.parent ? this.parent.serialize() : null,
		};
	}
}
