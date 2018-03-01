import DocScript from "../doc_models/DocScript";
import GMScript from "../gm_project/common/GMScript";

export default interface IDocumentationExtractor {
	extractDocScripts(script: GMScript): DocScript[];
}