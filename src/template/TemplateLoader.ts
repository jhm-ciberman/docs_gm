import * as fse from "fs-extra";
import { injectable } from "inversify";
import * as path from "path";
import Template from "./entities/Template";
import ITemplateLoader from "./interfaces/ITemplateLoader";
/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
@injectable()
export default class TemplateLoader implements ITemplateLoader {

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<Template> {
		let data: any;
		const jsonPath = path.resolve(folder, "template.json");
		try {
			data = await fse.readJSON(jsonPath);
		} catch (e) {
			throw new Error(`Error loading Template from "${jsonPath}"`);
		}
		return new Template(folder, data);
	}
}
