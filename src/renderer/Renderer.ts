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
		outputFolder = path.resolve(outputFolder);
		this._reporter.info(`Output folder: ${outputFolder}`);

		for (const page of queue.pages) {
			const filename = page.getFilename();
			this._reporter.info(`Rendering ${filename}`);

			const fullPath = path.resolve(outputFolder, filename);
			env.addGlobal("linkTo", this._buildLinkToFunction(queue, page));

			const html = this._renderPage(page, template, env);

			if (!html) {
				// tslint:disable-next-line:max-line-length
				this._reporter.warn(`Page for element: ${page.resource.name} cannot be rendered because template does not supports element of type [${page.resource.type}]`);
				continue;
			}

			await fse.outputFile(fullPath, html);
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

	private _buildLinkToFunction(queue: RenderingQueue, currentPage: Page): (e: DocResource) => string {
		return (element: DocResource) => {
			if (!element) {
				throw new Error("Invalid Element passed to linkTo(docElement) function: " + element);
			}
			const newPage = queue.findPage(element);
			if (!newPage) {
				throw new Error(`Trying to get page for element  "${element.name}" that is not in the project.`);
			}

			if (currentPage === newPage) {
				return currentPage.getLink() + "#" + element.name;
			}

			return this._relativePath(currentPage, newPage);
		};
	}

	private _relativePath(currentPage: Page, newPage: Page) {
		return path.relative(path.dirname(currentPage.getFilename()), newPage.getFilename()).replace("\\", "/");
	}

}
