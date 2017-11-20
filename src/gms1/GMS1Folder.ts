import { IGMFolder } from "../IGMInterfaces";
import ReporterManager from "../reporter/ReporterManager";
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
		super(project, parent, data.$.name);
		this.project = project;
		this.project.addResource(this, "folder");

		for (const folder of data.scripts || []) {
			this.children.push(new GMS1Folder(folder, project, this));
		}
		for (const script of data.script || []) {
			this.children.push(new GMS1Script(script, project, this));
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

	/**
	 * Print itself to the console for debug purposes
	 * @param spaces The number of spaces to use
	 */
	public print(spaces: number = 0): void {
		const sp = "  ".repeat(spaces);
		ReporterManager.reporter.debug(`${sp}+ ${this.name}`);
		spaces++;
		for (const child of this.children) {
			child.print(spaces);
		}
	}

}
