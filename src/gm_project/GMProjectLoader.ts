import * as fg from "fast-glob";
import * as path from "path";

import { injectable } from "inversify";
import GMS1ProjectLoader from "./gms1/GMS1ProjectLoader";
import GMS2ProjectLoader from "./gms2/GMS2ProjectLoader";
import IGMProject from "./IGMProject";
import IGMProjectLoader from "./IGMProjectLoader";

/**
 * This Factory class loads a GMS1 or GMS2 project and returns a GMProject object
 */
@injectable()
export default class GMProjectLoader implements IGMProjectLoader {

	/**
	 * Loads a specified GMS1 or GMS2 Project
	 * @param gmProjectPath The project path to load
	 * @return A promise with the loaded project
	 */
	public async load(gmProjectPath: string): Promise<IGMProject> {
		const files = await fg("./*.{yyp,gmx}", {
			absolute: true,
			cwd: path.resolve(gmProjectPath),
		});

		if (files.length === 0) {
			throw new Error("Unrecognized GM project. No *.yyp or *.gmx file found");
		}

		const extArr = path.extname(files[0]).split(".");

		const ext = extArr[extArr.length - 1];

		let loader: IGMProjectLoader;
		if (ext === "gmx") {
			loader = new GMS1ProjectLoader();
		} else {
			loader = new GMS2ProjectLoader();
		}
		return loader.load(files[0]);
	}
}
