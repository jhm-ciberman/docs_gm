import { IGMFolder, IGMResource } from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";
import IGetResourceByKey from "./IGetResourceByKey";
import * as GMS2Descriptor from "./IGMS2Descriptor";

/**
 * Represents any folder in the resource tree of GMS2
 */
export class GMS2Folder extends GMS2Resource implements IGMFolder {

	/**
	 * An array with all the folder children resources
	 */
	private _children: IGMResource[] = [];

	/**
	 * The name of the top level container folder.
	 * For example "scipts", "objects", "rooms", etc.
	 */
	private _topLevelName: string;

	/**
	 * An array with all the IDs of the childrens
	 */
	private _childrenIDs: string[];

	constructor(data: GMS2Descriptor.IFolder) {
		super(data);
		this.name = data.folderName;
		this._childrenIDs = data.children;
		this._topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}

	/**
	 * An array with all the folder children resources
	 */
	get children() {
		return this._children;
	}

	/**
	 * The name of the top level container folder.
	 * For example "scipts", "objects", "rooms", etc.
	 */
	get topLevelName() {
		return this._topLevelName;
	}

	/**
	 * Load the specified resource and all the childrens
	 * @param project The GMS2Project (must have an getResourceByID method)
	 */
	public buildSubtree(project: IGetResourceByKey) {
		const ids = this._childrenIDs;
		this._childrenIDs = []; // to prevent infinite recursion
		for (const id of ids) {
			const r = project.getResourceByKey(id);
			if (r) {
				if (r instanceof GMS2Folder) {
					r.buildSubtree(project);
				}
				this.children.push(r);
				r.parent = this;
			}
		}
		return this;
	}

	/**
	 * The fullpath of the resource
	 */
	get fullpath(): string {
		return super.fullpath + "/";
	}

}

export default GMS2Folder;
