#!/usr/bin/env node

import * as program from "commander";
import * as path from "path";
import open = require("open");

import DocsGM from "../DocsGM";
import Documentation from "../doc_generator/Documentation";
import OutputConfig from "../doc_generator/OutputConfig";


var config = new OutputConfig();
config.templatesFolder = path.resolve(__dirname, "../../templates");

function setFilter(value:string) {
	config.pattern = value;
}

async function generateDoumentation(projectPath?:string) {

	DocsGM.console.info("Loading Project...");
	var project = await DocsGM.loadProject(projectPath);

	DocsGM.console.info("Loading Resource Tree...");
	await project.load();

	DocsGM.console.info("Generating documentation... ");
	await Documentation.generate(project, config);

	DocsGM.console.info("Ready!");
	
	var url = path.resolve(config.outFolder, "index.html");
	DocsGM.console.info(`Opening ${url}`);
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
