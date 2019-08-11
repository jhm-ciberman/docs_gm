import * as fse from "fs-extra";
import { inject, injectable } from "inversify";

import * as nunjucks from "nunjucks";
import * as path from "path";
import DocResource from "../doc_models/DocResource";
import IReporter from "../reporter/IReporter";
import Template from "../template/Template";
import { TYPES } from "../types";
import IRenderer from "./IRenderer";
import Page from "./Page";
import RenderingQueue from "./RenderingQueue";

@injectable()
export default class Renderer implements IRenderer {

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	public async render(template: Template, queue: RenderingQueue, outputFolder: string): Promise<void> {

		const env = this._createEnv(template.folder);

		for (const page of queue.pages) {
			const link = page.getLink();
			this._reporter.info(`Rendering ${link}`);

			const filename = path.resolve(outputFolder, link);

			env.addGlobal("linkTo", this._buildLinkToFunction(queue, filename));

			const html = this._renderPage(page, template, env);

			if (!html) {
				// tslint:disable-next-line:max-line-length
				this._reporter.warn(`Page for element: ${page.resource.name} cannot be rendered because template does not supports element of type [${page.resource.type}]`);
				continue;
			}

			await fse.outputFile(filename, html);
		}
	}

	private _createEnv(templateFolder: string) {
		return nunjucks.configure(templateFolder, {
			autoescape: false,
			throwOnUndefined: true,
		});
	}

	private _renderPage(page: Page, template: Template, env: nunjucks.Environment): string | undefined {
		const templatePath = template.getTemplatePathFor(page.resource.type);
		if (!templatePath) {
			return;
		}
		const nunjucksTemplate = env.getTemplate(templatePath, true);
		return nunjucksTemplate.render(page.getContext());
	}

	private _buildLinkToFunction(queue: RenderingQueue, currentFile: string): (e: DocResource) => string {
		return (e: DocResource) => {
			if (!e) {
				throw new Error("Invalid Element passed to linkTo(docElement) function: " + e);
			}
			const page = queue.findPage(e);
			if (!page) {
				throw new Error(`Trying to get page for element  "${e.name}" that is not in the project.`);
			}
			return path.relative(path.dirname(currentFile), page.getLink()).replace("\\", "/");
		};
	}

}
