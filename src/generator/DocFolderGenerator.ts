import { inject, injectable } from "inversify";
import IProjectConfig from "../config/IProjectConfig";
import DocFolder from "../doc_models/DocFolder";
import DocResource from "../doc_models/DocResource";
import GMResourceHelper from "../gm_project/GMResourceHelper";
import IGMFolder from "../gm_project/IGMFolder";
import IGMProject from "../gm_project/IGMProject";
import IGMResource from "../gm_project/IGMResource";
import { TYPES } from "../types";
import IDocFolderGenerator from "./IDocFolderGenerator";
import IScriptLoader from "./IScriptLoader";

@injectable()
export default class DocFolderGenerator implements IDocFolderGenerator {

	@inject(TYPES.IScriptLoader)
	private _scriptLoader: IScriptLoader;

	/**
	 * Load a GMFolder and all its content
	 * @param folder The GMFolder to load
	 */
	public async generate(folder: IGMFolder, config: IProjectConfig, gmProject: IGMProject): Promise<DocFolder> {
		const docFolder = new DocFolder(folder.name);
		docFolder.description = await this._loadFolderDocumentation(folder, config, gmProject);
		for (const res of folder.children) {
			const children = await this._loadResource(res, config, gmProject);
			for (const child of children) {
				child.parent = docFolder;
				docFolder.children.push(child);
			}
		}
		return docFolder;
	}

	private async _loadFolderDocumentation(folder: IGMFolder, config: IProjectConfig, gmProject: IGMProject) {
		if (folder.moduleScript) {
			const docScript = await this._scriptLoader.load(folder.moduleScript, config, gmProject);
			if (docScript.length > 0) {
				return docScript[0].description;
			}
		}
		return "";
	}

	private async _loadResource(res: IGMResource, config: IProjectConfig, gmProject: IGMProject): Promise<DocResource[]> {
		if (GMResourceHelper.isFolder(res)) {
			const f = await this.generate(res, config, gmProject);
			return f.children.length === 0 ? [] : [f];
		} else if (GMResourceHelper.isScript(res)) {
			return this._scriptLoader.load(res, config, gmProject);
		} else {
			throw new Error(`Unrecognized resource type for resource "${res.name}"`);
		}
	}
}
