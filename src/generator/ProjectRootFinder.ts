import { injectable } from "inversify";
import GMResourceHelper from "../gm_project/GMResourceHelper";
import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IProjectRootFinder from "./interfaces/IProjectRootFinder";

@injectable()
export default class ProjectRootFinder implements IProjectRootFinder {

	public find(folder: IGMFolder, path: string): IGMFolder {
		return this._findRootFolder(folder, path.split("/"));
	}

	private _findRootFolder(folder: IGMFolder, pathArr: string[]): IGMFolder {
		const name = pathArr.shift();
		if (name === undefined) {
			return folder;
		}
		for (const child of folder.children) {
			if (GMResourceHelper.isFolder(child) && child.name === name) {
				return this._findRootFolder(child, pathArr);
			}
		}
		throw new Error("Project root folder not found");
	}
}
