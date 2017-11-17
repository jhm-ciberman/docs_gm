import DocFolder from "./DocFolder";

/**
 * Represents any resource in the output documentation
 */
export default abstract class DocResource {

	/**
	 * The name of the folder. Example "enemies".
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
}
