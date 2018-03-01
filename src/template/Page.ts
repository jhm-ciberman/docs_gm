import * as nunjucks from "nunjucks";

// import DocFolder from "../models/DocFolder";
import DocPage from "../doc_models/DocPage";
import PageFeeder from "../generator/PageFeeder";
import PageFeedWith from "./enums/PageFeedWith";

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
	 * Possible values are "script"
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
	 * @param pageFeeder The PageFeeder used to feed the DocPages to the Page
	 * @returns An iterator with a [filename, content] value for each output file
	 */
	public * generate(env: nunjucks.Environment, pageFeeder: PageFeeder): IterableIterator<[string, string]> {
		const template = env.getTemplate(this._in, true);
		for (const feedPage of this._getDocPages(pageFeeder)) {
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
	private _getDocPages(pageFeeder: PageFeeder): IterableIterator<DocPage> {
		switch (this._feedWith) {
			case PageFeedWith.Script:
				return pageFeeder.oneScriptPerPage();
			case PageFeedWith.Scripts:
				return pageFeeder.allTheScriptsInOnePage();
			case PageFeedWith.Folder:
				throw new Error(`Not implemented`);
		}
	}
}
