import * as fse from "fs-extra";
import * as path from "path";

import IGMProject from "../interfaces/IGMProject";
import IGMProjectLoader from "../interfaces/IGMProjectLoader";
import GMS2ProjectFactory from "./GMS2ProjectFactory";
import GMS2ResourceType from "./GMS2ResourceType";
import { IFolder, IProject, IResource, IScript } from "./IGMS2Descriptor";

/**
 * Creates a new GameMakerStudio 2 Project Factory that loads a project
 * file and creates a new GMProject
 */
export default class GMS2ProjectLoader implements IGMProjectLoader {
	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	public async load(projectFile: string): Promise<IGMProject> {
		const projectFolder = path.dirname(projectFile);
		const factory = new GMS2ProjectFactory(projectFolder);

		const data: IProject = await fse.readJson(projectFile);

		for (const item of data.resources) {
			const resourceJsonFile = path.resolve(projectFolder, item.Value.resourcePath);
			const resourceData: IResource = await fse.readJson(resourceJsonFile);
			this._createFromData(factory, item.Key, resourceData);
		}

		return factory.build();
	}

	/**
	 * Creates a GMS2Resource from a YOYO model data
	 * @param modelData The YOYO model data to create the GMS2Resource from
	 */
	private _createFromData(factory: GMS2ProjectFactory, key: string, modelData: IResource): void {
		switch (modelData.modelName) {
			case GMS2ResourceType.GMFolder:
				const folderData = modelData as IFolder;
				return factory.addFolder(key, folderData.name, folderData.localisedFolderName, folderData.children);
			case GMS2ResourceType.GMScript:
				const scriptData = modelData as IScript;
				return factory.addScript(key, scriptData.name, scriptData.IsCompatibility);
			default:
				return factory.addResource(key, modelData.name);
		}
	}

}
