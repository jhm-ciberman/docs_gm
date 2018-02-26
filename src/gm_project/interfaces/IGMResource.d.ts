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

	/**
	 * Returns true if the resource match the specified glob pattern
	 * @param {string} pattern The glob pattern to match
	 */
	match(pattern: string): boolean;
}