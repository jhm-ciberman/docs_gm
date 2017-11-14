#!/usr/bin/env node

import * as program from "commander";
import * as path from "path";
import open = require("open");
var packageJSON = require("../../package.json");
import DocsGM from "../DocsGM";
import Documentation from "../doc_generator/Documentation";


async function generate(projectPath?:string) {

	DocsGM.console.info("Loading Project...");
	var project = await DocsGM.loadProject(projectPath);

	DocsGM.console.info("Loading project configuration...");
	var config = await DocsGM.loadConfig(projectPath);

	if (!config) {
		DocsGM.console.info("Configuration not found. Ussing default configuration.");
	}
	DocsGM.console.info("Loading Resource Tree...");
	await project.load();

	DocsGM.console.info("Generating documentation... ");
	var outFolder = await Documentation.generate(project, config);

	DocsGM.console.info("Ready!");
	
	var url = path.resolve(outFolder, "index.html");
	DocsGM.console.info(`Opening ${url}`);
	open(url);
}

async function init() {

	var file = await DocsGM.exportConfig();

	DocsGM.console.info("Base configuration file was created at: ");
	DocsGM.console.info(file);
	DocsGM.console.info("Now, you need to add the configuration to your project. ")
	DocsGM.console.info("");
	DocsGM.console.info("Instructions:");
	DocsGM.console.info("1 - Open your project in GameMaker:Studio or GameMaker Studio 2.");
	DocsGM.console.info("2 - Right click on the \"Included Files\" folder in the resource tree.")
	DocsGM.console.info("3 - Click on \"Insert Included File\".");
	DocsGM.console.info("3 - Navigate to the following path and select the file docs_gm.json.");
	DocsGM.console.info(file);
	DocsGM.console.info("4 - Click on the added resource and select Platforms: \"None\". Then save your project.");
	DocsGM.console.info("");
	DocsGM.console.info("When you are ready, you can run the \"docs_gm generate\" command from the ");
	DocsGM.console.info("command line to create the documentation for your project. ");
	DocsGM.console.info("Check the online documentation of docs_gm for more info. ");
	DocsGM.console.info("If you want to edit the configuration right click on the docs_gm.json file on");
	DocsGM.console.info("your project and selct \"Show in explorer\". Then edit the JSON file with any text editor.");
}

program
	.version(packageJSON.version);

program
	.command("init")
	.description("Exports the base configuration file for docs_gm and shows the instructions to add the configuration to your project")
	.action(() => {
		init().catch(err => {
			DocsGM.console.error(err);
		})
	});

program
	.command("generate [path]")
	.description("Generates the documentation HTML files for the specified project path")
	.action((path) => {
		generate(path).catch(err => {
			DocsGM.console.error(err);
		})
	});



program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
