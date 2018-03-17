import { injectable } from "inversify";
import * as path from "path";
import IDocElement from "../doc_models/interfaces/IDocElement";
import ILinkToBuilder from "./interfaces/ILinkToBuilder";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class LinkToBuilder implements ILinkToBuilder {
	public build(queue: RenderingQueue, currentPath: string): (e: IDocElement) => string {
		return (e: IDocElement) => {
			if (!e) {
				const error = new Error("Invalid Element passed to linkTo(docElement) function: " + e);
				throw error;
			}
			const link = queue.linkTo(e);
			return path.relative("./" + currentPath, "./" + link);
		};
	}
}
