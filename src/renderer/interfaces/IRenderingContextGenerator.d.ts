import IRenderingContext from "./IRenderingContext";
import RenderingQueue from "../RenderingQueue";
import IDocElement from "../../doc_models/interfaces/IDocElement";
import DocProject from "../../doc_models/DocProject";

export default interface IRenderingContextGenerator {
	generate(project: DocProject, element: IDocElement, queue: RenderingQueue, currentPath: string): IRenderingContext;
}