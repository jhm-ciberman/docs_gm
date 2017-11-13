#!/usr/bin/env node

import * as program from "commander";
import * as path from "path";
import open = require("open");

import Main from "../Main";
import Documentation from "../doc_generator/Documentation";
import OutputConfig from "../doc_generator/OutputConfig";


var config = new OutputConfig();
config.templatesFolder = path.resolve(__dirname, "../../templates");

function setFilter(value:string) {
	config.pattern = value;
}

async function generateDoumentation(projectPath?:string) {

	console.log("Loading Project...");
	var project = await Main.loadProject(projectPath);

	console.log("Loading Resource Tree...");
	await project.load();

	console.log("Generating documentation... ");
	await Documentation.generate(project, config);

	console.log("Ready!");
	
	var url = path.resolve(config.outFolder, "index.html");
	console.log(`Opening ${url}`);
	open(url);
}

program
	.version("1.0.0")
	.command("generate [path]")
	.description("Generates the documentation HTML files for the specified project path")
	.option("-f, --filter <value>", "Specify what scripts should be added to the output documentation", setFilter)
	.action((path) => {
		generateDoumentation(path).catch(err => {
			console.error(err);
		})
	});
program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
