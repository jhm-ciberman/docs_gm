import { inject, injectable } from "inversify";
import { IParsingConfig } from "../config/IProjectConfig";
import { ParsingConfig } from "../config/ProjectConfig";
import DocScript from "../doc_models/DocScript";
import IReporter from "../reporter/IReporter";
import { TYPES } from "../types";
import DocScriptFactory from "./DocScriptFactory";
import IJSDocParser from "./IJSDocParser";
import IScriptCommentParser from "./IScriptCommentParser";
import UnrecognizedTagError from "./UnrecognizedTagError";

/**
 * Class for parsing the GML scripts and JSDocs comments inside those scripts
 */
@injectable()
export default class JSDocParser implements IJSDocParser {

	@inject(TYPES.IScriptCommentParser)
	private _scriptCommentParser: IScriptCommentParser;

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	/**
	 * Parses a gml script string and extracts all the documentation for a passed script
	 * and returns a new DocScript object.
	 * @param scriptName The script name
	 * @param text The script content
	 * @returns A new DocScript object
	 */
	public parse(scriptName: string, text: string, parsingConfig?: IParsingConfig): DocScript {

		parsingConfig = parsingConfig || new ParsingConfig();

		const tags = this._scriptCommentParser.parse(text);

		const factory = new DocScriptFactory(scriptName, parsingConfig.mergeDuplicateParams);

		for (const tag of tags) {
			try {
				tag.accept(factory);
			} catch (e) {
				if (!(e instanceof UnrecognizedTagError)) {
					throw e;
				}

				if (parsingConfig.warnUnrecognizedTags) {
					this._reporter.warn(`Unrecognized tag "${ e.tagName }" at script "${ scriptName }"`);
				}
			}
		}

		return factory.make();
	}

}
