import DocResource from "./DocResource";

/**
 * Represents a single folder of the GameMaker resource tree.
 */
export default class DocFolder extends DocResource {

	/**
	 * The folder description, if exists. It will be extracted from the
	 * first script whose name starts with `MODULE_` or `FOLDER_`.
	 */
	public description: string | null = null;

	/**
	 * The resource type
	 */
	public readonly type: string = "folder";

	/**
	 * The children resources inside the folder
	 */
	public children: DocResource[] = [];

	/**
	 * Folder name
	 */
	public name: string;

	/**
	 * Creates an instance of DocFolder.
	 * @param {string} name
	 * @memberof DocFolder
	 */
	constructor(name: string) {
		super(name);
	}

}
