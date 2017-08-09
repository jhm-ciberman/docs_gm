import * as path from "path";
import * as fse from "fs-extra";

import GMS2Resource from "./GMS2Resource";
import GMProject from "./GMS2Project";
import ScriptParser from "../doc_generator/ScriptParser";
import DocScript from "../docs_models/DocScript";
import {GMScript} from "../GMInterfaces";

export default class GMS2Script extends GMS2Resource implements GMScript {

	public name:string;
	public isCompatibility:boolean;
	private text:string|undefined = undefined;
	constructor(data:GMS2ScriptData, project:GMProject) {
		super(data, project);
		this.isCompatibility = data.IsCompatibility;
	}

	public async load() {
		if (this.isCompatibility) {
			var filePath = path.resolve(this.project.path, "scripts", "@" + this.name, this.name + ".gml");
		} else {
			var filePath = path.resolve(this.project.path, "scripts", this.name, this.name + ".gml");
		}

		this.text = await fse.readFile(filePath, "utf8");
		return this;
	}

	public parse():DocScript[] {
        if (!this.text) {
            throw "Please call first loadGML() before parse the current GMScript";
        }

		// This lines converts the triple slash comments ( ///comment)
		// to JSDoc comments
		var str = this.text
			.replace(/\/\/\/ ?(.*)\n/g, "/**\n * $1 \n */\n")
			.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		var scr = ScriptParser.parse(str, this.name);
		return scr ? [scr] : [];
	}

};
