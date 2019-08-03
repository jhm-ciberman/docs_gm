import { injectable } from "inversify";
import GMResourceHelper from "../gm_project/GMResourceHelper";
import IGMFolder from "../gm_project/IGMFolder";
import IProjectRootFinder from "./IProjectRootFinder";

@injectable()
export default class ProjectRootFinder implements IProjectRootFinder {

	/**
	 * Finds the project root according to a given path
	 * @param folder The base project folder
	 * @param path The path to the project root
	 * @returns The project root folder according to the given path
	 */
	public find(folder: IGMFolder, path: string): IGMFolder {
		return this._findRootFolder(folder, path.split("/"));
	}

	private _findRootFolder(folder: IGMFolder, pathArr: string[]): IGMFolder {
		const name = this._getNextPathPortion(pathArr);
		if (name === undefined) {
			return folder;
		} else {
			return this._findChild(folder, pathArr, name);
		}
	}

	private _findChild(folder: IGMFolder, pathArr: string[], name: string): IGMFolder {
		for (const child of folder.children) {
			if (GMResourceHelper.isFolder(child) && child.name === name) {
				return this._findRootFolder(child, pathArr);
			}
		}
		throw new Error("Project root folder not found");
	}

	private _getNextPathPortion(pathArr: string[]): string | undefined {
		let name: string | undefined;
		do {
			name = pathArr.shift();
		} while (name === "");
		return name;
	}
}
