import * as fse from "fs-extra";
import * as globby from "globby";
import * as nunjucks from "nunjucks";
import * as path from "path";
import DocProject from "../docs_models/DocProject";
import ReporterManager from "../reporter/ReporterManager";
import Page from "./Page";
import * as TemplateJSON from "./templateJSON";

/**
 * Represents a single design of one Template
 */
export default class Design {

	/**
	 * The design name (string id)
	 */
	public readonly name: string;

	/**
	 * The design display name
	 */
	public readonly displayName: string;

	/**
	 * An array with the globs ussed when copying files from the input template folder to the
	 * output documentation folder.
	 */
	private  _copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

	/**
	 * An array with the pages of the template
	 */
	private _pages: Page[] = [];

	/**
	 * The template folder
	 */
	private _templateFolder: string;

	/**
	 * Creates a new Design Object
	 * @param name The design instance name
	 * @param template TThe template to which this design belongs
	 * @param data The data to populate over this design
	 */
	constructor(name: string, templateFolder: string, data: TemplateJSON.IDesign) {
		this.name = name;
		this.displayName = data.displayName;
		this._copy = data.copy || this._copy;
		for (const page of data.pages) {
			const p = new Page(page.in, page.out, page.feedWith);
			this._pages.push(p);
		}
		this._templateFolder = templateFolder;
	}

	/**
	 * Renders the documentation for the specified docProject and place the HTML files and the
	 * other files inside the outputFolder.
	 * @param outputFolder The output folder
	 * @param docProject The docProject to render the documentation
	 */
	public async render(outputFolder: string, docProject: DocProject) {
		const env = nunjucks.configure(this._templateFolder, { autoescape: false });

		for (const page of this._pages) {
			for (const [out, content] of page.generate(env, docProject)) {
				const filename = path.resolve(outputFolder, out);
				await fse.outputFile(filename, content);
			}
		}

		const files = await globby(this._copy, { cwd: this._templateFolder });

		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(this._templateFolder, file);
			// TODO: replace this info with an EventDispatcher event
			ReporterManager.reporter.info(`COPYING: ${file}`);
			await fse.copy(inputFile, outputFile);
		}
	}
}
