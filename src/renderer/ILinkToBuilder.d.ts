import RenderingQueue from "./RenderingQueue";
import DocResource from "../doc_models/DocResource";

export default interface ILinkToBuilder {
	build(queue: RenderingQueue, currentFile: string): (e: DocResource) => string;
}