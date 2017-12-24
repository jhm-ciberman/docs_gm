import { IGMFolder, IGMResource } from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";
import * as GMS2Descriptor from "./IGMS2Descriptor";

/**
 * Represents any folder in the resource tree of GMS2
 */
export class GMS2Folder extends GMS2Resource implements IGMFolder {

	/**
	 * An array with all the folder children resources
	 */
	public children: IGMResource[] = [];

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
		this.name = data.folderName;
		this._childrenIDs = data.children;
		this.topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}

	/**
	 * Load the specified resource and all the childrens
	 * @param project The GMS2Project (must have an getResourceByID method)
	 */
	public async buildSubtree(project: IGetResourceByID) {
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
		return super.fullpath + "/";
	}

}

export interface IGetResourceByID {
	getResourceById(id: string): IGMResource | undefined;
}

export default GMS2Folder;
