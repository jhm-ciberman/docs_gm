import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as nunjucks from "nunjucks";
import * as path from "path";
import DocProject from "../doc_models/DocProject";
import IReporter from "../reporter/interfaces/IReporter";
import Design from "../template/Design";
import { TYPES } from "../types";
import ILinkToBuilder from "./interfaces/ILinkToBuilder";
import IRenderingContext from "./interfaces/IRenderingContext";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class NunjucksRenderer {

	@inject(TYPES.ILinkToBuilder)
	private _linkToBuilder: ILinkToBuilder;

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	public async render(design: Design, docProject: DocProject, outputFolder: string): Promise<void> {
		const env = nunjucks.configure(design.template.folder, {
			autoescape: false,
			throwOnUndefined: true,
		});

		const queue = new RenderingQueue(docProject);
		queue.linkTo(docProject.root);

		let element = queue.next();
		while (element) {
			this._reporter.info(`Rendering page for element: ${element.name} [${element.type}]`);
			const template = env.getTemplate(design.index, true);
			const currentPath = queue.linkTo(element);
			const filename = path.resolve(outputFolder, currentPath);

			env.addGlobal("linkTo", this._linkToBuilder.build(queue, currentPath));

			const ctx: IRenderingContext = {project: docProject, element};
			const html = template.render(ctx);

			await fse.outputFile(filename, html);

			element = queue.next();
		}

	}

}
