import { IGMFolder } from "../IGMInterfaces";
import { ResourceType } from "../IGMInterfaces";
import * as GMS1Descriptor from "./GMS1Descriptor";
import GMS1Project from "./GMS1Project";
import GMS1Resource from "./GMS1Resource";
import GMS1Script from "./GMS1Script";

/**
 * Represents a GMS1 Folder resource
 */
export default class GMS1Folder extends GMS1Resource implements IGMFolder {

	/**
	 * The children of that folder
	 */
	public children: GMS1Resource[] = [];

	/**
	 * Creates a new Folder Resource
	 * @param data The YOYO model data of the folder
	 * @param project The base project for the folder
	 * @param parent The parent folder for this folder
	 */
	constructor(data: GMS1Descriptor.IFolder, project: GMS1Project, parent: GMS1Folder | null) {
		super(parent, data.$.name);

		for (const folder of data.scripts || []) {
			const f = new GMS1Folder(folder, project, this);
			project.addResource(f, ResourceType.Folder);
			this.children.push(f);
		}

		for (const script of data.script || []) {
			const s = new GMS1Script(script, this);
			project.addResource(s, ResourceType.Script);
			this.children.push(s);
		}

	}

	/**
	 * Loads all the resources in the folder
	 * @returns A promise
	 */
	public async load(): Promise<this> {
		for (const resource of this.children) {
			await resource.load();
		}
		return this;
	}

}
