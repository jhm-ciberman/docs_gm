import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import { TYPES } from "../types";
import { ITemplate } from "./interfaces/ITemplate";
import ITemplateFactory from "./interfaces/ITemplateFactory";
import ITemplateLoader from "./interfaces/ITemplateLoader";
import { IRoot } from "./interfaces/TemplateJSON";
/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
@injectable()
export default class TemplateLoader implements ITemplateLoader {

	@inject(TYPES.ITemplateFactory)
	private _templateFactory: ITemplateFactory;

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<ITemplate> {
		let data: IRoot;
		const jsonPath = path.resolve(folder, "template.json");
		try {
			data = await fse.readJSON(jsonPath);
		} catch (e) {
			throw new Error(`Error loading Template from "${jsonPath}"`);
		}
		return this._templateFactory.create(folder, data);
	}
}
