import * as globby from "globby";
import * as path from "path";

import GMS1ProjectFactory from "../gm_project/gms1/GMS1ProjectFactory";
import GMS2ProjectFactory from "../gm_project/gms2/GMS2ProjectFactory";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IGMProjectFactory from "../gm_project/interfaces/IGMProjectFactory";

/**
 * This Factory class loads a GMS1 or GMS2 project and returns a GMProject object
 */
export default class ProjectLoader {

	/**
	 * Used for dependency injection
	 */
	public static depends = {
		globby,
	};

	/**
	 * The project path
	 */
	private readonly _gmProjectPath: string;

	/**
	 * Creates a new Project loader
	 * @param gmProjectPath The path of the project to load
	 */
	public constructor(gmProjectPath: string = ".") {
		this._gmProjectPath = gmProjectPath;
	}

	/**
	 * Loads a specified GMS1 or GMS2 Project
	 * @param GMProjectPath The project path to load
	 * @return A promise with the loaded project
	 */
	public async load(): Promise<IGMProject> {

		const files = await globby(this._gmProjectPath + "/*.{yyp,gmx}");

		if (files.length === 0) {
			throw new Error("Unrecognized GM project. No *.yyp or *.gmx file found");
		}

		const extArr = path.extname(files[0]).split(".");

		const ext = extArr[extArr.length - 1];

		let factory: IGMProjectFactory;
		switch (ext) {
			case "yyp":
				factory = new GMS2ProjectFactory(files[0]);
				break;
			case "gmx":
				factory = new GMS1ProjectFactory(files[0]);
				break;
			default:
				throw new Error(`Unrecognized project extension: "${ext}"`);
		}
		return factory.load();
	}
}
