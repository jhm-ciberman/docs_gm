import { inject, injectable } from "inversify";
import DocProject from "../doc_models/DocProject";
import { DocElementType } from "../doc_models/enums/DocElementType";
import IDocElement from "../doc_models/interfaces/IDocElement";
import { TYPES } from "../types";
import ILinkToBuilder from "./interfaces/ILinkToBuilder";
import IRenderingContext from "./interfaces/IRenderingContext";
import IRenderingContextGenerator from "./interfaces/IRenderingContextGenerator";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class RenderingContextGenerator implements IRenderingContextGenerator {

	@inject(TYPES.ILinkToBuilder)
	private _linkToBuilder: ILinkToBuilder;

	public generate(
		project: DocProject,
		element: IDocElement,
		queue: RenderingQueue,
		currentPath: string,
	): IRenderingContext {

		const linkTo = this._linkToBuilder.build(queue, currentPath);
		const context: IRenderingContext = {
			project,
			linkTo,
		};
		switch (element.type) {
			case DocElementType.Folder:
				context.folder = element;
				break;
			case DocElementType.Script:
				context.script = element;
				break;
			case DocElementType.Resource:
				context.resource = element;
				break;
		}
		return context;
	}
}
