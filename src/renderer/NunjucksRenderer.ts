import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import DocProject from "../doc_models/DocProject";
import Design from "../template/Design";
import { TYPES } from "../types";
import IRenderingContextGenerator from "./interfaces/IRenderingContextGenerator";
import NunjucksTemplateLookup from "./NunjucksTemplateLookup";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class NunjucksRenderer {

	@inject(TYPES.IRenderingContextGenerator)
	private _renderingContextGenerator: IRenderingContextGenerator;

	public async render(design: Design, docProject: DocProject, outputFolder: string): Promise<void> {
		const ntl = new NunjucksTemplateLookup(design);

		const queue = new RenderingQueue();
		queue.linkTo(docProject);

		let element = queue.next();
		while (element) {
			const template = ntl.get(element.type);
			const currentPath = queue.linkTo(element);
			const filename = path.resolve(outputFolder, currentPath);

			const ctx = this._renderingContextGenerator.generate(element, queue, currentPath);
			const html = template.render(ctx);

			await fse.outputFile(filename, html);

			element = queue.next();
		}

	}

}
