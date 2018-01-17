import * as globby from "globby";
import * as path from "path";

import GMS1Project from "../gm_project/gms1/GMS1Project";
import GMS2Project from "../gm_project/gms2/GMS2Project";
import IGMProject from "../gm_project/interfaces/IGMProject";

/**
 * This class loads a GMS1 or GMS2 project and returns a GMProject object
 */
export default class ProjectLoader {
	/**
	 * Loads a specified GMS1 or GMS2 Project
	 * @param GMProjectPath The project path to load
	 * @return A promise with the loaded project
	 */
	public static async loadProject(gmProjectPath: string = "."): Promise<IGMProject> {

		const files = await globby(gmProjectPath + "/*.{yyp,gmx}");

		if (files.length === 0) {
			throw new Error("Unrecognized GM project. No *.yyp or *.gmx file found");
		}

		const extArr = path.extname(files[0]).split(".");

		const ext = extArr[extArr.length - 1];

		switch (ext) {
			case "yyp":
				return GMS2Project.loadProject(files[0]);
			case "gmx":
				return GMS1Project.loadProject(files[0]);
			default:
				throw new Error(`Unrecognized project extension: "${ext}"`);
		}

	}
}
