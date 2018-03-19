import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocProject from "../doc_models/DocProject";
import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDocFolderGenerator from "./interfaces/IDocFolderGenerator";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";

/**
 * This class generates a DocProject
 */
@injectable()
export default class DocProjectGenerator implements IDocProjectGenerator {

	@inject(TYPES.IDocFolderGenerator)
	private _docFolderGenerator: IDocFolderGenerator;

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
		docProject.root = await this._docFolderGenerator.generate(scriptFolder, config, gmProject);
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
}
