import IGMResource from "../interfaces/IGMResource";
import IGMScript from "../interfaces/IGMScript";
import GMResource from "./GMResource";

/**
 * Represents any folder in the resource tree of Game Maker
 */
export default class GMFolder extends GMResource implements IGMResource {

	/**
	 * An array with all the folder children resources
	 */
	protected _children: IGMResource[] = [];

	/**
	 * The GMScript that holds the information and documentation about the module/folder.
	 * That is, a GMScript inside the folder whose name starts with "MODULE_" or with "FOLDER_"
	 */
	protected _moduleScript: IGMScript | null = null;

	/**
	 * Creates a new GMFolder
	 * @param name The folder name
	 */
	constructor(name: string) {
		super(name);
		this.name = name;
	}

	/**
	 * Ads a children
	 * @param childId The children ID
	 */
	public addChild(child: GMResource): void {
		child.parent = this;
		if (this._isGMScript(child) && (child.name.startsWith("MODULE_") || child.name.startsWith("FOLDER_"))) {
			this._moduleScript = child;
		} else {
			this._children.push(child);
		}

	}

	/**
	 * Returns an iterator with all the folder children
	 */
	get children() {
		return this._children[Symbol.iterator]();
	}

	/**
	 * Gets all the subtree leafs nodes recursively. That are
	 * all the GMResources that are not folders
	 */
	public getSubtreeLeafs(): IGMResource[] {
		let arr: IGMResource[] = [];
		for (const res of this._children) {
			if (res instanceof GMFolder) {
				arr = arr.concat(res.getSubtreeLeafs());
			} else {
				arr.push(res);
			}
		}
		return arr;
	}

	/**
	 * The fullpath of the resource
	 */
	get fullpath(): string {
		return super.fullpath + "/";
	}

	/**
	 * Returns the first GMScript whose name starts with "MODULE_" or with "FOLDER_".
	 */
	get moduleScript(): IGMScript | null {
		return this._moduleScript;
	}

	/**
	 * Returns true if the resource is a IGMScript
	 * @private
	 * @param {IGMResource} res
	 * @returns {res is IGMScript}
	 * @memberof GMFolder
	 */
	private _isGMScript(res: IGMResource): res is IGMScript {
		return ("subScripts" in res);
	}
}
