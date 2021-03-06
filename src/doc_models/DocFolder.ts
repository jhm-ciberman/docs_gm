import DocResource from "./DocResource";
import { DocResourceType } from "./DocResourceType";

/**
 * Represents a single folder of the GameMaker resource tree.
 */
export default class DocFolder extends DocResource {
	/**
	 * The folder description, if exists. It will be extracted from the
	 * first script whose name starts with `MODULE_` or `FOLDER_`.
	 */
	public description: string = "";

	/**
	 * The resource type
	 */
	public readonly type: DocResourceType = DocResourceType.Folder;

	/**
	 * The children resources inside the folder
	 */
	public children: DocResource[] = [];

	/**
	 * Folder name
	 */
	public name: string;

	/**
	 * Returns an array with all the leaf elements of the folder
	 * (The resources excluding the subfolders)
	 */
	get all() {
		let arr: DocResource[] = [];
		for (const element of this.children) {
			if (element instanceof DocFolder) {
				arr = arr.concat(element.all);
			} else {
				arr.push(element);
			}
		}
		return arr;
	}

	/**
	 * Returns the fullpath of the resource
	 */
	get fullpath(): string {
		if (this.project && this.project.root === this) {
			return "";
		}
		return this.parent ? this.parent.fullpath + this.name + "/" : this.name + "/";
	}

	/**
	 * Returns if the current folder is an ancestor of the the given resource
	 * @param res The resource
	 */
	public isParentOf(res: DocResource): boolean {
		if (!res.parent) {
			return false;
		}

		if (res.parent === this) {
			return true;
		}

		return this.isParentOf(res.parent);
	}
}
