import { injectable } from "inversify";
import DocProject from "../doc_models/DocProject";
import { DocElementType } from "../doc_models/enums/DocElementType";
import IDocElement from "../doc_models/interfaces/IDocElement";
import IRenderingContext from "./interfaces/IRenderingContext";
import IRenderingContextGenerator from "./interfaces/IRenderingContextGenerator";

@injectable()
export default class RenderingContextGenerator implements IRenderingContextGenerator {

	public generate(project: DocProject, element: IDocElement): IRenderingContext {
		const context: IRenderingContext = {project};
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
