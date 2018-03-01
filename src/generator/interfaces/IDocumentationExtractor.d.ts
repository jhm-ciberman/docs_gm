import DocScript from "../../doc_models/DocScript";
import GMScript from "../../gm_project/GMScript";

export default interface IDocumentationExtractor {
	extractDocScripts(script: GMScript): DocScript[];
}