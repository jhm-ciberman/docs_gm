#!/usr/bin/env node

import * as program from "commander";
import open = require("open");
import * as path from "path";
import { ReporterManager, OutputConfig } from "../index";

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

	ReporterManager.reporter.info("Base configuration file was created at: ");
	ReporterManager.reporter.info(file);
	ReporterManager.reporter.info("Now, you need to add the configuration to your project. ");
	ReporterManager.reporter.info("");
	ReporterManager.reporter.info("Instructions:");
	ReporterManager.reporter.info("1 - Open your project in GameMaker:Studio or GameMaker Studio 2.");
	ReporterManager.reporter.info("2 - Right click on the \"Included Files\" folder in the resource tree.");
	ReporterManager.reporter.info("3 - Click on \"Insert Included File\".");
	ReporterManager.reporter.info("3 - Navigate to the following path and select the file docs_gm.json.");
	ReporterManager.reporter.info(file);
	ReporterManager.reporter.info("4 - Click on the added resource and select Platforms: \"None\". Then save your project.");
	ReporterManager.reporter.info("");
	ReporterManager.reporter.info("When you are ready, you can run the \"docs_gm generate\" command from the ");
	ReporterManager.reporter.info("command line to create the documentation for your project. ");
	ReporterManager.reporter.info("Check the online documentation of docs_gm for more info. ");
	ReporterManager.reporter.info("If you want to edit the configuration right click on the docs_gm.json file on");
	ReporterManager.reporter.info("your project and selct \"Show in explorer\". Then edit the JSON file with any text editor.");
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
