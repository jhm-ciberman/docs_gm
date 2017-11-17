import * as fse from "fs-extra";
import * as globby from "globby";
import * as nunjucks from "nunjucks";
import * as path from "path";
import DocProject from "../docs_models/DocProject";
import DocsGM from "../DocsGM";
import Page from "./Page";
import Template from "./Template";
import * as TemplateJSON from "./templateJSON";

/**
 * Represents a single design of one Template
 */
export default class Design {

	/**
	 * An array with the globs ussed when copying files from the input template folder to the
	 * output documentation folder.
	 */
	public _copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

	/**
	 * An array with the pages of the template
	 */
	public _pages: Page[] = [];

	/**
	 * The template to which this Design belongs
	 */
	private _template: Template;

	/**
	 * Creates a new Design Object
	 * @param template TThe template to which this design belongs
	 * @param data The data to populate over this design
	 */
	constructor(template: Template, data: TemplateJSON.IDesign) {
		this._copy = data.copy || this._copy;
		for (const page of data.pages) {
			this._pages.push(new Page(page));
		}
		this._template = template;
	}

	/**
	 * Renders the documentation for the specified docProject and place the HTML files and the
	 * other files inside the outputFolder.
	 * @param outputFolder The output folder
	 * @param docProject The docProject to render the documentation
	 */
	public async render(outputFolder: string, docProject: DocProject) {
		const env = nunjucks.configure(this._template.folder, { autoescape: false });

		for (const page of this._pages) {
			await page.render(env, docProject, outputFolder);
		}

		const files = await globby(this._copy, { cwd: this._template.folder });

		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(this._template.folder, file);
			DocsGM.console.info(`COPYING: ${file}`);
			await fse.copy(inputFile, outputFile);
		}
	}
}
