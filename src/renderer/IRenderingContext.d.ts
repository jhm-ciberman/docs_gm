import DocProject from "../doc_models/DocProject";
import DocFolder from "../doc_models/DocFolder";
import DocScript from "../doc_models/DocScript";
import DocResource from "../doc_models/DocResource";

export default interface IRenderingContext {
	project: DocProject;
	element: DocResource;
}