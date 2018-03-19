import { TYPES } from "../types";

import { inject, injectable } from "inversify";

import * as yargs from "yargs";
import StringsEnglish from "../l18n/StringsEnglish";
import IReporter from "../reporter/interfaces/IReporter";
import ICliGenerateFacade from "./interfaces/ICliGenerateFacade.d";

// tslint:disable-next-line: no-var-requires
const packageJSON = require("../../../package.json");

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
		const lang = new StringsEnglish();
		// tslint:disable-next-line:no-unused-expression
		yargs
			.version(packageJSON.version)
			.command({
				command: "init",
				describe: lang.COMMAND_INIT,
				handler: () => this._init(lang),
			})
			.command({
				command: "generate [folder]",
				describe: lang.COMMAND_GENERATE,
				builder: (builder) => this._commandGenerateBuilder(builder, lang),
				handler: (arg) => this._generate(arg),
			})
			.demandCommand()
			.showHelpOnFail(true)
			.help()
			.parse(argv);
	}

	private _commandGenerateBuilder(builder: yargs.Argv, lang: StringsEnglish) {
		return builder
			.option("design", {
				type: "string",
				describe: lang.OPTION_DESIGN,
			})
			.option("template", {
				type: "string",
				describe: lang.OPTION_TEMPLATE,
			})
			.option("outputFolder", {
				type: "string",
				describe: lang.OPTION_OUTPUT_FOLDER,
			})
			.option("pattern", {
				alias: "p",
				type: "string",
				describe: lang.OPTION_PATTERN,
			})
			.option("root", {
				type: "string",
				describe: lang.OPTION_ROOT,
			})
			.option("noOpen", {
				type: "boolean",
				default: false,
				describe: lang.OPTION_NO_OPEN,
			});
	}

	/**
	 * Generates the documentation for the given project
	 * @param folder The input folder
	 */
	private _generate(args: yargs.Arguments) {
		this._cliGenerateFacade.generate(args.folder, args)
			.catch((err) => this._reporter.error(err));
	}
	/**
	 * Exports the docs_gm config json and output the instructions to the screen.
	 */
	private _init(lang: StringsEnglish) {
		this._cliGenerateFacade.init()
			.then((file) => {
				for (const str of lang.CONFIG_INSTRUCTIONS) {
					this._reporter.info(str.replace("%%FILE%%", file));
				}
			})
			.catch((err) => this._reporter.error(err));
	}

}
