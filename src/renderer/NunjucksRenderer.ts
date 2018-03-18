import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as nunjucks from "nunjucks";
import * as path from "path";
import DocProject from "../doc_models/DocProject";
import IReporter from "../reporter/interfaces/IReporter";
import Design from "../template/Design";
import { TYPES } from "../types";
import IInputFileResolver from "./interfaces/IInputFileResolver";
import IRenderingContextGenerator from "./interfaces/IRenderingContextGenerator";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class NunjucksRenderer {

	@inject(TYPES.IRenderingContextGenerator)
	private _renderingContextGenerator: IRenderingContextGenerator;

	@inject(TYPES.IInputFileResolver)
	private _inputFileResolver: IInputFileResolver;

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	public async render(design: Design, docProject: DocProject, outputFolder: string): Promise<void> {
		const env = nunjucks.configure(design.template.folder, {
			autoescape: false,
			throwOnUndefined: true,
		});

		const queue = new RenderingQueue();
		queue.linkTo(docProject);

		let element = queue.next();
		while (element) {
			this._reporter.info(`Rendering page for element: ${element.name} [${element.type}]`);
			const inputFile = this._inputFileResolver.resolve(design, element.type);
			const template =  env.getTemplate(inputFile, true);
			const currentPath = queue.linkTo(element);
			const filename = path.resolve(outputFolder, currentPath);

			const ctx = this._renderingContextGenerator.generate(docProject, element, queue, currentPath);
			const html = template.render(ctx);

			await fse.outputFile(filename, html);

			element = queue.next();
		}

	}

}
