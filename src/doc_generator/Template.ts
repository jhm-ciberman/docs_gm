
import * as fse from "fs-extra";
import * as path from "path";

import DocProject from "../docs_models/DocProject";
import Design from "./Design";
import OutputConfig from "./OutputConfig";
import * as TemplateJSON from "./templateJSON";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

	/**
	 * Loads the template
	 * @returns A promise
	 */
	public static async loadFrom(folder: string): Promise<Template> {
		const template = path.resolve(folder, "template.json");
		if (!fse.existsSync(template)) {
			throw new Error(`Template ${template} does not exists`);
		}
		const str = await fse.readFile(template, "utf8");
		const data = JSON.parse(str);

		return new Template(data, folder);
	}

	/**
	 * The folder of the template
	 */
	public folder: string;

	/**
	 * The template author
	 */
	public author: string;

	/**
	 * The default design name
	 */
	public defaultDesign: Design | undefined;

	/**
	 * The default design name
	 */
	public description: string;

	/**
	 * The web of the author of the template
	 */
	public web: string;

	/**
	 * A map containing with the designs. Each key is the name of the design.
	 */
	private _designs: Map<string, Design> = new Map();

	/**
	 * Creates a new Template object
	 * @param folder the folder that contains the template
	 */
	constructor(data: TemplateJSON.IRoot, folder: string) {
		for (const name of Object.keys(data.designs)) {
			const design = new Design(this, data.designs[name]);
			this._designs.set(name, design);
		}

		this.defaultDesign = this._designs.get(data.defaultDesign);
		if (!this.defaultDesign) {
			throw new Error("Default design name is invalid");
		}

		this.folder = path.resolve(folder);
		this.author = data.author;
		this.description = data.description;
		this.web = data.web;
	}

	/**
	 * Generates the documentation for the specified project. The DocProject
	 * must be already loaded.
	 * @param docProject The DocProject to generate the documentation for
	 * @param config The configuration to use
	 */
	public async generateDocs(docProject: DocProject, config: OutputConfig) {
		if (this._designs.size === 0) {
			throw new Error("Template contains no designs");
		}

		const design = this._designs.get(config.design) || this.defaultDesign;
		if (!design) {
			throw new Error(`Design was not found`);
		}

		const out = path.resolve(config.out);
		design.render(out, docProject);

	}

}
