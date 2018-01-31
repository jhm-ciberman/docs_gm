import * as nunjucks from "nunjucks";

// import DocFolder from "../models/DocFolder";
import DocPage from "../models/DocPage";
import DocProject from "../models/DocProject";
import PageFeedWith from "./PageFeedWith";

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
	private _feedWith: PageFeedWith;

	/**
	 * Creates a new TemplatePage
	 */
	constructor(input: string, output: string, feedWith: PageFeedWith) {
		this._in = input;
		this._out = output;
		this._feedWith = feedWith;
	}

	/**
	 * Generates all the HTML strings corresponding to this TemplatePage
	 * @param env The nunjucks Environment object
	 * @param docProject the DocProject to generate the pages for
	 * @returns An iterator with a [filename, content] value for each output file
	 */
	public * generate(env: nunjucks.Environment, docProject: DocProject): IterableIterator<[string, string]> {
		const template = env.getTemplate(this._in, true);
		for (const feedPage of this._getFeedPages(docProject)) {
			const data = { page: feedPage };
			const str = template.render(data);
			const out = nunjucks.renderString(this._out, data);
			yield [out, str];
		}

	}

	/**
	 * Generator function that returns an iterator with each DocPage for the specified project.
	 * @param docProject The docProject to get the pages
	 */
	private * _getFeedPages(docProject: DocProject): IterableIterator<DocPage> {
		let page: DocPage;
		switch (this._feedWith.toLowerCase()) {
			case PageFeedWith.Script:
				for (const script of docProject.scripts) {
					page = this._createPage(docProject);
					page.script = script;
					yield page;
				}
				break;
			case PageFeedWith.Scripts:
				page = this._createPage(docProject);
				page.scripts = docProject.scripts;
				yield page;
				break;
			/*case PageFeedWith.Folder:
				for (const script of docProject.scripts) {
					page = this._createPage(docProject);
					page.folder = script;
					yield page;
				}
				page = this._createPage(docProject);
				page.folder = docProject;

				yield page;
				break;*/
		}
	}

	/**
	 * Creates a new DocPage
	 * @param docProject The doc project
	 */
	private _createPage(docProject: DocProject): DocPage {
		const page = new DocPage();
		page.project = docProject;
		return page;
	}

	/**
	 * Recursively gets all the subfolders for a given folder
	 * @param folder The folder to get the subfolders
	 */
	/*private _getSubFolders(folder: DocFolder): DocFolder[] {
		let arr: DocFolder[] = [];
		for (const resource of folder.children) {
			if (resource instanceof DocFolder) {
				arr.push(resource);
				arr = arr.concat(this._getSubFolders(resource));
			}
		}
		return arr;
	}*/
}
