import { inject, injectable } from "inversify";
import { DocElementType } from "../doc_models/enums/DocElementType";
import IDocElement from "../doc_models/interfaces/IDocElement";
import { TYPES } from "../types";
import ILinkToBuilder from "./interfaces/ILinkToBuilder";
import IRenderingContext from "./interfaces/IRenderingContext";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class RenderingContextGenerator {

	@inject(TYPES.ILinkToBuilder)
	private _linkToBuilder: ILinkToBuilder;

	public generate(element: IDocElement, queue: RenderingQueue, currentPath: string): IRenderingContext {
		const linkTo = this._linkToBuilder.build(queue, currentPath);

		switch (element.type) {
			case DocElementType.Project:
				return { project: element, linkTo };
			case DocElementType.Folder:
				return { folder: element, linkTo };
			case DocElementType.Script:
				return { script: element, linkTo };
			case DocElementType.Resource:
				return { resource: element, linkTo };
		}
	}
}
