import * as path from "path";

import Design from "./Design";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

	/**
	 * Static factory method to create a Template. Can throw if the defaultDesign name is invalid
	 * @param data The template data
	 * @param folder The folder to load from
	 */
	public static create(data: TemplateJSON.IRoot, folder: string) {
		const template = new Template(data, folder);
		if (!template.defaultDesign) {
			throw new Error("Default design name is invalid");
		}
		return template;
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
	 * @param data the template data
	 * @param folder the folder that contains the template
	 */
	private constructor(data: TemplateJSON.IRoot, folder: string) {
		this.folder = path.resolve(folder);
		this.author = data.author;
		this.description = data.description;
		this.web = data.web;

		for (const name of Object.keys(data.designs)) {
			const design = new Design(name, this.folder, data.designs[name]);
			this._designs.set(name, design);
		}

		const d = this._designs.get(data.defaultDesign);
		if (d) {
			this.defaultDesign = d;
		}
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
