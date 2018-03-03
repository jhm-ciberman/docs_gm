
import * as nunjucks from "nunjucks";
import RenderablePage from "../entities/RenderablePage";
import DocProject from "../../doc_models/DocProject";
import Page from "../entities/Page";

export default interface IRenderablePageGenerator {
	getPages(page: Page, docProject: DocProject): IterableIterator<RenderablePage>;
}