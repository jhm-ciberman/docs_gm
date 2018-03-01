import * as program from "commander";
import { inject } from "inversify";
import * as os from "os";
import ConfigManager from "../config/ConfigManager";
import ReporterManager from "../reporter/ReporterManager";
import { TYPES } from "../types";
import ICliGenerateFacade from "./ICliGenerateFacade.d";

// tslint:disable-next-line: no-var-requires
const packageJSON = require("../package.json");

/**
 * This class is responsible for showing the CLI interface. It has a single method parse(argv).
 */
export default class Cli {

	/**
	 * Creates a new Cli instance
	 * @param f The injected CLIGenerateFacade
	 */
	constructor(
		@inject(TYPES.ICliGenerateFacade) f: ICliGenerateFacade,
	) {

		program
			.version(packageJSON.version);

		program
			.command("init")
			// tslint:disable-next-line:max-line-length
			.description("Exports the base configuration file for docs_gm and shows the instructions to add the configuration to your project")
			.action(() => this._init());

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
			.action((folder) => {
				f.generate(folder).catch((err) => {
					ReporterManager.reporter.error(err);
				});
			});
	}

	/**
	 * Parses the arguments and shows the CLI on screen.
	 * @param argv The argv array (normally process.argv)
	 */
	public parse(argv: string[]): void {
		program.parse(argv);

		if (!argv.slice(2).length) {
			program.help();
		}
	}

	/**
	 * Exports the docs_gm config json and output the instructions to the screen.
	 */
	private _init() {
		const configManager = new ConfigManager();
		const userDir = os.homedir();
		configManager.exportConfig(userDir)
			.then((file) => this._outputConfigInstructions(file))
			.catch((err) => ReporterManager.reporter.error(err));
	}

	/**
	 * Show on the screen the instructions about how to copy and install the configuration file
	 * @param file The output config file path
	 */
	private _outputConfigInstructions(file: string) {
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

}
