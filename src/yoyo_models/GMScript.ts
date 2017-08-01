import GMResource from "./GMResource";
import GMProject from "./GMProject";
import path = require("path");
import fse = require("fs-extra");
import parse = require("comment-parser");
import DocScript from "../docs_models/DocScript";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";


export default class GMScript extends GMResource {


	public name:string;
	public isCompatibility:boolean;
	private text:string|undefined = undefined;
	constructor(data:GMScriptData, project:GMProject) {
		super(data, project);
		this.isCompatibility = data.IsCompatibility;
	}

	public async loadGML() {
		if (this.isCompatibility) {
			var filePath = path.resolve(this.project.path, "scripts", "@" + this.name, this.name + ".gml");
		} else {
			var filePath = path.resolve(this.project.path, "scripts", this.name, this.name + ".gml");
		}

		this.text = await fse.readFile(filePath, "utf8");
		return this;
	}

	public parse() {
        if (!this.text) {
            throw Error("Please call first loadGML() before parse the current GMScript");
        }

		// This lines converts the triple slash comments ( /// my comment)
		// to JSDoc comments
		var str = this.text
			.replace(/\/\/\/ ?(.*)\n/g, "/**\n * $1 \n */\n")
			.replace(/ ?\*\/\n\/\*\* ?\n/g, "");

		var comments = parse(str);
		var script = new DocScript();

		script.name = this.name;
		
		for (var comment of comments) {
			script.description = comment.description;

			for (var tag of comment.tags) {
				switch (tag.tag.toLowerCase()) {
					case "param":
					case "arg":
					case "argument":
						var param = new DocParam();
						param.name = tag.name;
						param.type = tag.type;
						param.optional = tag.optional;
						param.description = tag.description;
						script.params.push(param);
						break;
					case "description":
					case "desc":
						script.description = tag.description;
						break;
					case "returns":
					case "return":
						script.returns = script.returns || new DocReturns();
						script.returns.description = tag.description;
						script.returns.type = tag.type;
						break;
				}
			}

		}

		return script;
	}

};
