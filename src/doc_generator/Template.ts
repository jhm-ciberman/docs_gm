import * as fse from "fs-extra";
import * as path from "path";

import Design from "./Design";
import * as TemplateJSON from "./templateJSON";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

	public static getInstalledPath: (name: string) => string;
	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public static async loadFrom(folder: string): Promise<Template> {
		const jsonPath = path.resolve(folder, "template.json");
		const data = await fse.readJSON(jsonPath);
		return new Template(data, folder);
	}

	/**
	 * The folder of the template
	 */
	public readonly folder: string;

	/**
	 * The template author
	 */
	public readonly author: string;

	/**
	 * The default design name
	 */
	public readonly defaultDesign: Design;

	/**
	 * The default design name
	 */
	public readonly description: string;

	/**
	 * The web of the author of the template
	 */
	public readonly web: string;

	/**
	 * A map containing with the designs. Each key is the name of the design.
	 */
	private _designs: Map<string, Design> = new Map();

	/**
	 * Creates a new Template object
	 * @param folder the folder that contains the template
	 */
	public constructor(data: TemplateJSON.IRoot, folder: string) {
		this.folder = path.resolve(folder);
		this.author = data.author;
		this.description = data.description;
		this.web = data.web;

		for (const name of Object.keys(data.designs)) {
			const design = new Design(name, this.folder, data.designs[name]);
			this._designs.set(name, design);
		}

		const d = this._designs.get(data.defaultDesign);
		if (!d) {
			throw new Error("Default design name is invalid");
		}
		this.defaultDesign = d;

	}

	/**
	 * Finds a design by name. Returns the default design if not found
	 * @param design The design name.
	 */
	public getDesign(design: string): Design {
		return this._designs.get(design) || this.defaultDesign;
	}

	/**
	 * Returns if the design exists in the template
	 * @param design The design name
	 */
	public hasDesign(design: string): boolean {
		return this._designs.has(design);
	}

	/**
	 * Iterator function to get all the designs of the template
	 */
	public designs(): IterableIterator<Design> {
		return this._designs.values();
	}

}
