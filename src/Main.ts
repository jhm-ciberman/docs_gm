
import globby = require("globby");
import fse = require("fs-extra");
import GMProject from "./yoyo_models/GMProject";


export default class Main {

	constructor() { }

	static async loadProject(GMProjectPath:string) {
		var files   = await globby(GMProjectPath + "/*.yyp");
		var string  = await fse.readFile(files[0], "utf8");
		var project = new GMProject(JSON.parse(string), GMProjectPath);
		return project;
	}



};
