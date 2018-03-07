import * as TemplateJSON from "../interfaces/TemplateJSON";
import Design from "./Design";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

	/**
	 * The folder of the template
	 */
	public folder: string;

	/**
	 * The template author
	 */
	public author: string | undefined;

	/**
	 * The default design name
	 */
	public defaultDesign: Design;

	/**
	 * The default design name
	 */
	public description: string | undefined;

	/**
	 * The web of the author of the template
	 */
	public web: string | undefined;

	/**
	 * A map containing with the designs. Each key is the name of the design.
	 */
	private _designs: Map<string, Design> = new Map();

	/**
	 * Creates an instance of Template.
	 * @param {string} folder The template folder
	 * @memberof Template
	 */
	public constructor(folder: string, data: TemplateJSON.IRoot) {
		this.folder = folder;
		this.folder = folder;
		this.author = data.author;
		this.description = data.description;
		this.web = data.web;

		for (const name of Object.keys(data.designs)) {
			const design = new Design(this, data.designs[name]);
			this._designs.set(name, design);
		}

		const d = this.getDesign(data.defaultDesign);
		if (!d) {
			throw new Error("Default design name is invalid");
		} else {
			this.defaultDesign = d;
		}
	}

	/**
	 * Finds a design by name. Returns the default design if not found
	 * @param design The design name.
	 */
	public getDesign(design: string): Design | undefined {
		return this._designs.get(design);
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
