import * as fse from "fs-extra";
import { inject, injectable } from "inversify";

import * as path from "path";
import DocResource from "../doc_models/DocResource";
import IReporter from "../reporter/IReporter";
import Template from "../template/Template";
import { TYPES } from "../types";
import IRenderer from "./IRenderer";
import LinkResolver from "./LinkResolver";
import NunjucksCompiler from "./NunjucksCompiler";
import PagePreprocesor from "./PagePreprocesor";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class Renderer implements IRenderer {

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	public async render(template: Template, queue: RenderingQueue, outputFolder: string): Promise<void> {

		const compiler = new NunjucksCompiler(template.folder);

		outputFolder = path.resolve(outputFolder);
		this._reporter.info(`Rendering documentation to output folder: ${outputFolder}`);

		for (const page of queue.pages) {
			const filename = page.getFilename();

			try {
				const linkResolver = new LinkResolver(queue, page);
				const pagePreprocesor = new PagePreprocesor(linkResolver);
				pagePreprocesor.preprocessPage(page);

				compiler.addGlobal("linkTo", (resource: DocResource) => linkResolver.linkTo(resource));
				compiler.addGlobal("asset", (assetName: string) => linkResolver.asset(assetName));

				const templatePath = template.getTemplatePathFor(page.type);
				const html = compiler.render(templatePath, page.getContext());

				const fullPath = path.resolve(outputFolder, filename);
				await fse.outputFile(fullPath, html);
			} catch (e) {
				this._reporter.error(`Error rendering ${filename}`);
				throw e;
			}

		}
	}

}
