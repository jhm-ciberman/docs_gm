import GMResource from "./GMResource";
import GMResourceHelper from "./GMResourceHelper";
import IGMFolder from "./IGMFolder";
import IGMResource from "./IGMResource";
import IGMScript from "./IGMScript";

/**
 * Represents any folder in the resource tree of Game Maker
 */
export default class GMFolder extends GMResource implements IGMFolder {

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
	}

	/**
	 * Ads a children
	 * @param childId The children ID
	 */
	public addChild(child: IGMResource): void {
		child.parent = this;
		if (GMResourceHelper.isScript(child) && (child.name.startsWith("MODULE_") || child.name.startsWith("FOLDER_"))) {
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
}
