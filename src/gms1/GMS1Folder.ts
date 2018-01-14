import { IGMFolder } from "../IGMInterfaces";
import GMS1Resource from "./GMS1Resource";

/**
 * Represents a GMS1 Folder resource
 */
export default class GMS1Folder extends GMS1Resource implements IGMFolder {

	/**
 	* The children of that folder
 	*/
	private _children: GMS1Resource[] = [];

	/**
	 * Creates a new Folder Resource
	 * @param data The folder name
	 * @param parent The parent folder for this folder
	 */
	constructor(name: string, parent: GMS1Folder | null) {
		super(parent, name);
	}

	/**
	 * The children of that folder
	 */
	get children() {
		return this._children;
	}

}
