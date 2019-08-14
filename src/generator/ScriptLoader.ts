import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import * as fse from "fs-extra";
import * as path from "path";

import { IProjectConfig } from "../config/IProjectConfig";
import DocScript from "../doc_models/DocScript";
import IGMProject from "../gm_project/IGMProject";
import IGMScript from "../gm_project/IGMScript";
import IDocumentationExtractor from "./IDocumentationExtractor";
import IScriptLoader from "./IScriptLoader";

/**
 * This class loads a GMScript and extracts the documentation for it
 */
@injectable()
export default class ScriptLoader implements IScriptLoader {

	/**
	 * The documentationExtractor used to extract the documentation of the GMScripts
	 */
	@inject(TYPES.IDocumentationExtractor)
	private _extractor: IDocumentationExtractor;

	/**
	 * Loads a single GMScript with all the subscripts from disk and extracts
	 * the documentation from it. It can return an empty array if the gmScript is not included in the
	 * glob pattern inside the project config.
	 */
	public async load(gmScript: IGMScript, config: IProjectConfig, gmProject: IGMProject): Promise<DocScript[]> {
		if (!gmScript.match(config.pattern)) {
			return [];
		}
		const pathStr = path.resolve(gmProject.path, gmScript.filepath);
		let str;
		try {
			str = await fse.readFile(pathStr, "utf8");
		} catch (e) {
			throw new Error(`Error loading file ${pathStr}`);
		}
		const it = gmScript.subScripts(str);
		return this._extractor.extractDocScripts(it, config.scripts, config.parser);
	}
}
