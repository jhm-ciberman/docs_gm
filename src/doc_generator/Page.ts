import * as fse from "fs-extra";
import * as nunjucks from "nunjucks";
import * as path from "path";

import DocPage from "../docs_models/DocPage";
import DocProject from "../docs_models/DocProject";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents one Page for one Design of one Template
 */
export default class Page {

	/**
	 * The input file of the page
	 */
	private _in: string;

	/**
	 * The output file of the page. Can be a templating string.
	 * Will be parsed by nunjuncks
	 */
	private _out: string;

	/**
	 * Posible values are "script"
	 */
	private _feedWith: "script" | "scripts";

	/**
	 * Creates a new TemplatePage
	 * @param data The data to populate the Page with
	 */
	constructor(data: TemplateJSON.IPage) {
		this._in = data.in;
		this._out = data.out;
		this._feedWith = data.feedWith;
	}

	/**
	 * Generates all the HTML files corresponding to this TemplatePage
	 * @param env The nunjucks Environment object
	 * @param docProject the DocProject to generate the pages for
	 * @param outFolder The output folder for the HTML files
	 * @returns A promise
	 */
	public async render(env: nunjucks.Environment, docProject: DocProject, outFolder: string) {
		const template = env.getTemplate(this._in, true);
		const it = this._getFeedPages(docProject);
		for (const feedPage of it) {
			const data = { page: feedPage };
			const str = template.render(data);
			const out = nunjucks.renderString(this._out, data);
			const file = path.resolve(outFolder, out);
			await fse.outputFile(file, str);
		}

	}

	/**
	 * Generator function that returns an iterator with each DocPage for the specified project.
	 * @param docProject The docProject to get the pages
	 */
	private * _getFeedPages(docProject: DocProject): IterableIterator<DocPage> {
		let page: DocPage;
		switch (this._feedWith) {
			case "script":
				for (const script of docProject.scripts) {
					page = new DocPage();
					page.project = docProject;
					page.script = script;
					yield page;
				}
				break;
			case "scripts":
				page = new DocPage();
				page.scripts = docProject.scripts;
				page.project = docProject;
				yield page;
				break;
		}
	}
}
