import { injectable } from "inversify";
import * as path from "path";
import DocResource from "../doc_models/DocResource";
import ILinkToBuilder from "./ILinkToBuilder";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class LinkToBuilder implements ILinkToBuilder {
	public build(queue: RenderingQueue, currentFile: string): (e: DocResource) => string {
		return (e: DocResource) => {
			if (!e) {
				const error = new Error("Invalid Element passed to linkTo(docElement) function: " + e);
				throw error;
			}
			const link = queue.linkTo(e);
			return path.relative(path.dirname(currentFile), link).replace("\\", "/");
		};
	}
}
