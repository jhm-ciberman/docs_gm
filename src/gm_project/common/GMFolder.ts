import IGMFolder from "../interfaces/IGMFolder";
import IGMResource from "../interfaces/IGMResource";
import GMResource from "./GMResource";

/**
 * Represents any folder in the resource tree of Game Maker
 */
export default class GMFolder extends GMResource implements IGMFolder {

	/**
	 * An array with all the folder children resources
	 */
	private _children: IGMResource[] = [];

	constructor(name: string) {
		super(name);
		this.name = name;
	}

	/**
	 * Ads a children
	 * @param childId The children ID
	 */
	public addChild(child: IGMResource): void {
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
	 * The fullpath of the resource
	 */
	get fullpath(): string {
		return super.fullpath + "/";
	}

}
