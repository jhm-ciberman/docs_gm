import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import * as fse from "fs-extra";
import * as globby from "globby";
import * as nunjucks from "nunjucks";
import * as path from "path";

import DocProject from "../doc_models/DocProject";
import Design from "./entities/Design";
import IDesignRenderer from "./interfaces/IDesignRenderer";
import IRenderablePageGenerator from "./interfaces/IRenderablePageGenerator";

/**
 * This class renders a given design and writes the files to an output folder.
 * It also copy the other files needed by the Design
 */
@injectable()
export default class DesignRenderer implements IDesignRenderer {

	/**
	 * The renderable page generator
	 */
	@inject(TYPES.IRenderablePageGenerator)
	private _renderablePageGenerator: IRenderablePageGenerator;

	/**
	 * Renders the documentation HTML files for the specified docProject.
	 * @param outputFolder The output folder
	 * @param docProject The docProject to generate the documentation for
	 */
	public async render(design: Design, docProject: DocProject, outputFolder: string): Promise<string> {
		const env = nunjucks.configure(design.template.folder, { autoescape: false });
		for (const page of design.pages) {
			const nunjucksTemplate = env.getTemplate(page.in, true);
			for (const rp of this._renderablePageGenerator.getPages(page, docProject)) {
				const content = nunjucksTemplate.render(rp.encodedData);
				const filename = path.resolve(outputFolder, rp.outputFile);
				await fse.outputFile(filename, content);
			}
		}
		await this._copyFiles(outputFolder, design);
		return outputFolder;
	}

	/**
	 * Copy the Design files inside the outputFolder. By default, it will copy
	 * all files except the package.json, template.json and *.njk files.
	 * @param outputFolder The output folder
	 */
	private async _copyFiles(outputFolder: string, design: Design) {
		const files = await globby(design.copy, { cwd: design.template.folder });
		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(design.template.folder, file);
			await fse.copy(inputFile, outputFile);
		}
	}
}
