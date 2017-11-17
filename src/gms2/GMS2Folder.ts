import DocsGM from "../DocsGM";
import { IGMFolder } from "../GMInterfaces";
import * as GMS2Descriptor from "./GMS2Descriptor";
import GMS2Project from "./GMS2Project";
import GMS2Resource from "./GMS2Resource";

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

	constructor(data: GMS2Descriptor.IFolder, project: GMS2Project) {
		super(data, project);
		this.folderName = data.folderName;
		this._childrenIDs = data.children;
		this.topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}

	/**
	 * Load the specified resource and all the childrens
	 */
	public async load() {
		for (const id of this._childrenIDs) {
			const r = this.project.getResourceById(id);
			if (r) {
				this.children.push(r);
				r.parent = this;
				if (r instanceof GMS2Folder) {
					r.load(); // recursive
				}
			}
		}
		return this;
	}

	/**
	 * Print itself to the console for debug purposes
	 * @param spaces The number of spaces to use
	 */
	public print(spaces: number = 0) {
		const sp = "  ".repeat(spaces);
		DocsGM.console.debug(`${sp}+ ${this.folderName}`);
		spaces++;
		for (const child of this.children) {
			child.print(spaces);
		}
	}

	/**
	 * The fullpath of the resource
	 */
	get fullpath(): string {
		return (this.parent ? this.parent.fullpath : "/") + this.folderName + "/";
	}

}
