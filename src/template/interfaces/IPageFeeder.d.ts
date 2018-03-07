import DocPage from "../../doc_models/DocPage";
import DocProject from "../../doc_models/DocProject";

export default interface IPageFeeder {
	oneScriptPerPage(docProject: DocProject): IterableIterator<DocPage>;
	allTheScriptsInOnePage(docProject: DocProject): IterableIterator<DocPage>;
}