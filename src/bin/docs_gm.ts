#!/usr/bin/env node

import program = require("commander");
import Main from "../Main";
import Documentation from "../Documentation";
import OutputConfig from "../OutputConfig";
import path = require("path");
import open = require("open");

var config = new OutputConfig();
config.templatesFolder = path.resolve(__dirname, "../../templates");

function setFilter(value:string) {
	config.pattern = value;
}



program
	.version("1.0.0")
	.arguments("[path]")
	.option("-f, --filter <value>", "Specify what scripts should be added to the output documentation", setFilter)
	.action((path) => {
		generateDoumentation(path).catch(err => {
			console.error(err);
		})
	});

async function generateDoumentation(projectPath = ".") {
	console.log("Loading Project...");
	var project = await Main.loadProject(projectPath);
	console.log("Loading Resource Tree...");
	await project.loadResourceTree();
	console.log("Generating doc sources list... ");
	var doc = new Documentation(project, config);
	console.log("Loading template... ");
	await doc.loadTemplate();
	console.log("Parsing project... ");
	await doc.parseProject();
	console.log("Generating documentation... ");
	await doc.generateDocs();
	console.log("Ready!");
	var url = path.resolve(config.outFolder, "index.html");
	console.log(`Opening ${url}`);
	open(url);
}

program.parse(process.argv);
