#!/usr/bin/env node

import * as program from "commander";
import * as os from "os";
import CliGenerateFacade from "./cli/CliGenerateFacade";
import ConfigManager from "./config/ConfigManager";
import ReporterManager from "./reporter/ReporterManager";

// tslint:disable-next-line: no-var-requires
const packageJSON = require("../package.json");

const f = new CliGenerateFacade();

program
	.version(packageJSON.version);

program
	.command("init")
	// tslint:disable-next-line:max-line-length
	.description("Exports the base configuration file for docs_gm and shows the instructions to add the configuration to your project")
	.action(() => {
		const configManager = new ConfigManager();
		const userDir = os.homedir();
		configManager.exportConfig(userDir).then((file) => {
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
		}).catch((err) => {
			ReporterManager.reporter.error(err);
		});
	});

program
	.command("generate [path]")
	.description("Generates the documentation HTML files for the specified project path")
	.option(
		"--design <name>",
		"The design name. If empty, it will use the first design in the designs list.",
		(value) => { f.design = value; },
	)
	.option(
		"--template <name>",
		"The template name to use",
		(value) => { f.template = value; },
	)
	.option(
		"--outputFolder <path>",
		"The output folder of the documentation",
		(value) => { f.outputFolder = value; },
	)
	.option(
		"-p, --pattern <glob>",
		"The glob pattern to use to include files in the project documentation",
		(value) => { f.pattern = value; },
	)
	.action( (folder) => {
		f.generate(folder).catch((err) => {
			ReporterManager.reporter.error(err);
		});
	});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
