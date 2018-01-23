import IGMFolder from "./IGMFolder";

/**
 * Represents a single GameMaker Resource
 */
export default interface IGMResource {
	/**
	 * The resource parent
	 */
	parent: IGMFolder | null;

	/**
	 * The full path of the resource inside GM resources tree
	 */
	fullpath: string;

	/**
	 * The name of the resource
	 */
	name: string;
}