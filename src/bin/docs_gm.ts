#!/usr/bin/env node

import * as program from "commander";
import open = require("open");
import * as path from "path";
import { DocsGM, OutputConfig, ReporterManager } from "../index";

// tslint:disable-next-line: no-var-requires
const packageJSON = require("../../package.json");

const overrideConfig = {} as OutputConfig;

/**
 * Generates the documentation for a given project
 * @param projectPath The path to the project
 * @param opts The option object to override
 */
async function generate(projectPath?: string, opts?: OutputConfig) {

	ReporterManager.reporter.info("Loading Project...");
	const project = await DocsGM.loadProject(projectPath);

	ReporterManager.reporter.info("Loading project configuration...");
	let config = await DocsGM.loadConfig(projectPath);

	if (!config) {
		ReporterManager.reporter.info("Configuration not found. Ussing default configuration.");
		config = new OutputConfig();
	}
	if (opts) {
		config = Object.assign(config, opts);
	}

	ReporterManager.reporter.info("Loading Resource Tree...");
	await project.load();

	ReporterManager.reporter.info("Generating documentation... ");
	const outFolder = await DocsGM.generate(project, config);

	ReporterManager.reporter.info("Ready!");

	const url = path.resolve(outFolder, "index.html");
	ReporterManager.reporter.info(`Opening ${url}`);
	open(url);
}

/**
 * Generates the initial configuration file (docs_gm.json file)
 */
async function init() {

	const file = await DocsGM.exportConfig();

	const strings = [
		"Base configuration file was created at: ",
		file,
		"Now, you need to add the configuration to your project. ",
		"",
		"Instructions:",
		"1 - Open your project in GameMaker:Studio or GameMaker Studio 2.",
		"2 - Right click on the \"Included Files\" folder in the resource tree.",
		"3 - Click on \"Insert Included File\".",
		"3 - Navigate to the following path and select the file docs_gm.json.",
		file,
		"4 - Click on the added resource and select Platforms: \"None\". Then save your project.",
		"",
		"When you are ready, you can run the \"docs_gm generate\" command from the ",
		"command line to create the documentation for your project. ",
		"Check the online documentation of docs_gm for more info. ",
		"If you want to edit the configuration right click on the docs_gm.json file on",
		"your project and select \"Show in explorer\". Then edit the JSON file with any text editor.",
	];

	for (const str of strings) {
		ReporterManager.reporter.info(str);
	}
}

program
	.version(packageJSON.version);

program
	.command("init")
	// tslint:disable-next-line:max-line-length
	.description("Exports the base configuration file for docs_gm and shows the instructions to add the configuration to your project")
	.action(() => {
		init().catch((err) => {
			ReporterManager.reporter.error(err);
		});
	});

program
	.command("generate [path]")
	.description("Generates the documentation HTML files for the specified project path")
	.option(
		"--design <name>",
		"The design name. If empty, it will use the first design in the designs list.",
		(value) => { overrideConfig.design = value; },
	)
	.option(
		"--template <name>",
		"The template name to use",
		(value) => {overrideConfig.template = value; },
	)
	.option(
		"--out <path>",
		"The output folder of the documentation",
		(value) => { overrideConfig.out = value; },
	)
	.option(
		"-p, --pattern <glob>",
		"The glob pattern to use to include files in the project documentation",
		(value) => { overrideConfig.pattern = value; },
	)
	.action( (folder) => {
		generate(folder, overrideConfig).catch((err) => {
			ReporterManager.reporter.error(err);
		});
	});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
