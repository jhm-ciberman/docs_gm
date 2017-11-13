import * as path from "path";
import * as globby from "globby";
import GMS1Project from "./gms1/GMS1Project";
import GMS2Project from "./gms2/GMS2Project";
import { GMProject } from "./GMInterfaces";

export default class Main {


	static async loadProject(GMProjectPath: string = "."): Promise<GMProject> {

		var files = await globby(GMProjectPath + "/*.{yyp,gmx}");
		if (files.length === 0) {
			throw "Unrecognized GM project. No *.yyp or *.gmx file found";
		}
		var extArr = path.extname(files[0]).split(".");
		var ext = extArr[extArr.length - 1];
		switch (ext) {
			case "yyp":
				return GMS2Project.loadProject(files[0]);
			case "gmx":
				return GMS1Project.loadProject(files[0]);
			default:
				throw `Unrecognized project extension: "${ext}"`;
		}
	}



};
