import { inject, injectable } from "inversify";
import * as nunjucks from "nunjucks";
import { TYPES } from "../../types";
import DocPage from "../doc_models/DocPage";
import DocProject from "../doc_models/DocProject";
import Page from "./entities/Page";
import RenderablePage from "./entities/RenderablePage";
import PageFeedWith from "./enums/PageFeedWith";
import IPageFeeder from "./interfaces/IPageFeeder";
import IRenderablePageGenerator from "./interfaces/IRenderablePageGenerator";

/**
 * Generates a stream of RenderablePages for a given Page object
 */
@injectable()
export default class RenderablePageGenerator implements IRenderablePageGenerator {

	/**
	 * The page Feeder
	 */
	@inject(TYPES.IPageFeeder)
	private _pageFeeder: IPageFeeder;

	/**
	 * Generates all the HTML strings corresponding to this TemplatePage
	 * @param env The nunjucks Environment object
	 * @param pageFeeder The PageFeeder used to feed the DocPages to the Page
	 * @returns An iterator with a [filename, content] value for each output file
	 */
	public * getPages(page: Page, docProject: DocProject): IterableIterator<RenderablePage> {
		for (const feedPage of this._getDocPages(page, docProject)) {
			const renderablePage = new RenderablePage();
			const data = { page: feedPage };
			renderablePage.encodedData = data;
			renderablePage.inputFile = page.in;
			renderablePage.outputFile = nunjucks.renderString(page.out, data);
			yield renderablePage;
		}

	}

	/**
	 * Generator function that returns an iterator with each DocPage for the specified project.
	 * @param docProject The docProject to get the pages
	 */
	private _getDocPages(page: Page, docProject: DocProject): IterableIterator<DocPage> {
		switch (page.feedWith) {
			case PageFeedWith.Script:
				return this._pageFeeder.oneScriptPerPage(docProject);
			case PageFeedWith.Scripts:
				return this._pageFeeder.allTheScriptsInOnePage(docProject);
			case PageFeedWith.Folder:
				// todo: implement this
		}
		throw new Error(`Not implemented`);
	}
}
