import IRenderingContext from "./IRenderingContext";
import RenderingQueue from "../RenderingQueue";
import IDocElement from "../../doc_models/interfaces/IDocElement";

export default interface IRenderingContextGenerator {
	generate(element: IDocElement, queue: RenderingQueue, currentPath: string): IRenderingContext;
}