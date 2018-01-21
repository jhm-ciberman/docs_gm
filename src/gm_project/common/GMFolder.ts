import IGMResource from "../interfaces/IGMResource";
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
		this._children.push(child);
	}

	/**
	 * Returns an iterator with all the folder childrend
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

}
