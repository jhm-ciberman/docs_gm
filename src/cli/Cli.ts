import container from "../../inversify.config";
import { TYPES } from "../../types";

import * as program from "commander";
import { inject, injectable } from "inversify";
import * as os from "os";
import IConfigManager from "../config/interfaces/IConfigManager";
import IReporter from "../reporter/interfaces/IReporter";
import ICliGenerateFacade from "./interfaces/ICliGenerateFacade.d";

// tslint:disable-next-line: no-var-requires
const packageJSON = require("../package.json");

/**
 * This class is responsible for showing the CLI interface. It has a single method parse(argv).
 */
@injectable()
export default class Cli {

	/**
	 * The reporter
	 */
	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	/**
	 * The CliGenerateFacade instance
	 */
	@inject(TYPES.ICliGenerateFacade)
	private _cliGenerateFacade: ICliGenerateFacade;

	/**
	 * Parses the arguments and shows the CLI on screen.
	 * @param argv The argv array (normally process.argv)
	 */
	public parse(argv: string[]): void {
		this._initializeProgram();
		program.parse(argv);

		if (!argv.slice(2).length) {
			program.help();
		}
	}

	/**
	 * Inits the commander program instance
	 */
	private _initializeProgram() {

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
				(value) => { this._cliGenerateFacade.design = value; },
			)
			.option(
				"--template <name>",
				"The template name to use",
				(value) => { this._cliGenerateFacade.template = value; },
			)
			.option(
				"--outputFolder <path>",
				"The output folder of the documentation",
				(value) => { this._cliGenerateFacade.outputFolder = value; },
			)
			.option(
				"-p, --pattern <glob>",
				"The glob pattern to use to include files in the project documentation",
				(value) => { this._cliGenerateFacade.pattern = value; },
			)
			.action((folder) => {
				this._cliGenerateFacade.generate(folder).catch((err) => {
					this._reporter.error(err);
				});
			});
	}

	/**
	 * Exports the docs_gm config json and output the instructions to the screen.
	 */
	private _init() {
		const configManager = container.get<IConfigManager>(TYPES.IConfigManager);
		const userDir = os.homedir();
		configManager.exportConfig(userDir)
			.then((file) => this._outputConfigInstructions(file))
			.catch((err) => this._reporter.error(err));
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
			this._reporter.info(str);
		}
	}

}
