import { IGMFolder } from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";
import * as GMS2Descriptor from "./IGMS2Descriptor";
import IGMS2Project from "./IGMS2Project";

/**
 * Represents any folder in the resource tree of GMS2
 */
export default class GMS2Folder extends GMS2Resource implements IGMFolder {

	/**
	 * The folder name
	 */
	public folderName: string;

	/**
	 * An array with all the folder children resources
	 */
	public children: GMS2Resource[] = [];

	/**
	 * The name of the top level container folder.
	 * For example "scipts", "objects", "rooms", etc.
	 */
	public topLevelName: string;

	/**
	 * An array with all the IDs of the childrens
	 */
	private _childrenIDs: string[];

	constructor(data: GMS2Descriptor.IFolder) {
		super(data);
		this.folderName = data.folderName;
		this._childrenIDs = data.children;
		this.topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}

	/**
	 * Load the specified resource and all the childrens
	 */
	public async buildSubtree(project: IGMS2Project) {
		for (const id of this._childrenIDs) {
			const r = project.getResourceById(id);
			if (r) {
				this.children.push(r);
				r.parent = this;
				if (r instanceof GMS2Folder) {
					r.buildSubtree(project); // recursive
				}
			}
		}
		this._childrenIDs = [];
		return this;
	}

	/**
	 * The fullpath of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "/") + this.folderName + "/";
	}

}
