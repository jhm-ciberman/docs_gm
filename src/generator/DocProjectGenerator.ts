import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocFolder from "../doc_models/DocFolder";
import DocProject from "../doc_models/DocProject";
import DocResource from "../doc_models/DocResource";
import GMResourceHelper from "../gm_project/GMResourceHelper";
import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IGMResource from "../gm_project/interfaces/IGMResource";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";
import IScriptLoader from "./interfaces/IScriptLoader";

/**
 * This class generates a DocProject
 */
@injectable()
export default class DocProjectGenerator implements IDocProjectGenerator {

	/**
	 * The script loader
	 */
	@inject(TYPES.IScriptLoader)
	private _scriptLoader: IScriptLoader;

	/**
	 * Generates the DocProject for a given GMProject
	 */
	public async generate(gmProject: IGMProject, config: IProjectConfig): Promise<DocProject> {
		const rootFoldersMap = new Map<string, IGMFolder>();
		for (const folder of gmProject.children) {
			rootFoldersMap.set(folder.name, folder);
		}
		const docProject = new DocProject(gmProject.name);
		const scriptFolder = this._getRootFolder(rootFoldersMap, "scripts");
		docProject.scripts = await this._loadFolder(scriptFolder, config, gmProject);
		return docProject;
	}

	/**
	 * Returns the project root folder with the specified name or throw an error.
	 * @param name The name of the root folder
	 */
	private _getRootFolder(rootFoldersMap: Map<string, IGMFolder>, name: string) {
		const f = rootFoldersMap.get(name);
		if (!f) {
			throw new Error(`No ${ name } folder found`);
		}
		return f;
	}

	/**
	 * Load a GMFolder and all its content
	 * @param folder The GMFolder to load
	 */
	private async _loadFolder(folder: IGMFolder, config: IProjectConfig, gmProject: IGMProject): Promise<DocFolder> {
		const docFolder = new DocFolder(folder.name);
		for (const res of folder.children) {
			const children = await this._loadResource(res, config, gmProject);
			for (const child of children) {
				child.parent = docFolder;
				docFolder.children.push(child);
			}
		}
		return docFolder;
	}

	/**
	 * Loads a single resource, returns an array with the corresponding DocResources.
	 * (A single GMResource can be used to generate multiple DocResources.
	 * For example, a single GMScript with multiple subscripts)
	 * @param res The GMResource to load
	 */
	private async _loadResource(res: IGMResource, config: IProjectConfig, gmProject: IGMProject): Promise<DocResource[]> {
		if (GMResourceHelper.isFolder(res)) {
			return [await this._loadFolder(res, config, gmProject)];
		} else if (GMResourceHelper.isScript(res)) {
			return this._scriptLoader.load(res, config, gmProject);
		} else {
			throw new Error(`Unrecognized resource type for resource "${res.name}"`);
		}
	}

}
