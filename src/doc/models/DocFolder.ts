import DocResource from "./DocResource";

/**
 * Represents a single folder of the GameMaker resource tree.
 */
export default class DocFolder extends DocResource {

	/**
	 * The resource type
	 */
	public readonly type: string = "folder";

	/**
	 * The children resources inside the folder
	 */
	public children: DocResource[] = [];

}
