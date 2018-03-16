import * as fse from "fs-extra";
import { injectable } from "inversify";
import * as path from "path";
import DocProject from "../doc_models/DocProject";
import { DocElementType } from "../doc_models/enums/DocElementType";
import IDocElement from "../doc_models/interfaces/IDocElement";
import Design from "../template/Design";
import IRenderingContext from "./interfaces/IRenderingContext";
import NunjucksTemplateLookup from "./NunjucksTemplateLookup";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class NunjucksRenderer {

	public async render(design: Design, docProject: DocProject, outputFolder: string): Promise<void> {
		const ntl = new NunjucksTemplateLookup(design);

		const queue = new RenderingQueue();
		queue.linkTo(docProject);

		let element = queue.next();
		while (element) {
			const template = ntl.get(DocElementType.Project);
			const currentPath = queue.linkTo(element);
			const linkToFunction = (e: IDocElement) => {
				const link = queue.linkTo(e);
				return path.relative(currentPath, link);
			};
			const data = this._generateContext(element, linkToFunction);
			const html = template.render(data);
			const filename = path.resolve(outputFolder, currentPath);
			await fse.outputFile(filename, html);

			element = queue.next();
		}

	}

	private _generateContext(element: IDocElement, linkTo: (element: IDocElement) => string): IRenderingContext {
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
