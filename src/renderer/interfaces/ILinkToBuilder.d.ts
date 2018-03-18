import RenderingQueue from "../RenderingQueue";
import IDocElement from "../../doc_models/interfaces/IDocElement";

export default interface ILinkToBuilder {
	build(queue: RenderingQueue, currentFile: string): (e: IDocElement) => string;
}