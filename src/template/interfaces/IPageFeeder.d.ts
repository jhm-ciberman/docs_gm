import DocPage from "../../doc_models/DocPage";
import DocProject from "../../doc_models/DocProject";
import ISerializable from "../../doc_models/interfaces/ISerializable";
import { ISerializedPage } from "../../doc_models/interfaces/interfaces";

export default interface IPageFeeder {
	oneScriptPerPage(docProject: DocProject): IterableIterator<ISerializable<ISerializedPage>>;
	allTheScriptsInOnePage(docProject: DocProject): IterableIterator<ISerializable<ISerializedPage>>;
	oneFolderPerPage(docProject: DocProject): IterableIterator<ISerializable<ISerializedPage>>;
}