import * as fse from "fs-extra";
import * as path from "path";

import IGMProject from "../gm_project/interfaces/IGMProject";

import { inject } from "inversify";
import ProjectConfig from "../config/ProjectConfig";
import DocFolder from "../doc_models/DocFolder";
import { TYPES } from "../types";

import DocProject from "../doc_models/DocProject";
import DocResource from "../doc_models/DocResource";
import DocScript from "../doc_models/DocScript";
import GMScript from "../gm_project/GMScript";
import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IGMResource from "../gm_project/interfaces/IGMResource";

import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "./interfaces/IDocumentationExtractor";

/**
 * This class generates a DocProject
 */
export default class DocProjectGenerator implements IDocProjectGenerator {

	/**
	 * The GMProject to generate the DocProject for.
	 */
	private _gmProject: IGMProject;

	/**
	 * The documentationExtractor used to extract the documentation of the GMScripts
	 */
	@inject(TYPES.IDocumentationExtractor)
	private _extractor: IDocumentationExtractor;

	/**
	 * A map with the name of each root folder and the associated GMFolder.
	 */
	private _rootFoldersMap: Map<string, IGMFolder> = new Map<string, IGMFolder>();

	/**
	 * The pattern to filter the DocProject
	 */
	private _pattern: string;

	/**
	 * Creates an instance of DocProjectGenerator.
	 * @param {IGMProject} gmProject The GMProject to generate the DocProject
	 * @param {ProjectConfig} projectConfig The project configuration
	 * @memberof DocProjectGenerator
	 */
	constructor(
		@inject(TYPES.IGMProject) gmProject: IGMProject,
		@inject(TYPES.IProjectConfig) projectConfig: ProjectConfig) {
		this._gmProject = gmProject;
		// Find all the project resources that match the input pattern
		this._pattern = projectConfig.output.pattern;

		for (const folder of this._gmProject.children) {
			this._rootFoldersMap.set(folder.name, folder);
		}
	}

	/**
	 * Generates the DocProject for a given GMProject
	 */
	public async generate() {
		const docProject = new DocProject(this._gmProject.name);
		const scriptFolder = this._getRootFolder("scripts");
		docProject.scripts = await this._loadFolder(scriptFolder);
		return docProject;
	}

	/**
	 * Returns the project root folder with the specified name or throw an error.
	 * @param name The name of the root folder
	 */
	private _getRootFolder(name: string) {
		const f = this._rootFoldersMap.get(name);
		if (!f) {
			throw new Error(`No ${ name } folder found`);
		}
		return f;
	}

	/**
	 * Load a GMFolder and all its content
	 * @param folder The GMFolder to load
	 */
	private async _loadFolder(folder: IGMFolder): Promise<DocFolder> {
		const docFolder = new DocFolder(folder.name);
		for (const res of folder.children) {
			docFolder.children = docFolder.children.concat(await this._loadResource(res));
		}
		return docFolder;
	}

	/**
	 * Returns true if the resource is a IGMFolder
	 */
	private _isFolder(res: IGMResource): res is IGMFolder {
		return (res as IGMFolder).children !== undefined;
	}

	/**
	 * Returns true if the resource is a GMScript
	 */
	private _isScript(res: IGMResource): res is GMScript {
		return (res as GMScript).loadFromString !== undefined;
	}

	/**
	 * Loads a single resource, returns an array with the corresponding DocResources.
	 * (A single GMResource can be used to generate multiple DocResources.
	 * For example, a single GMScript with multiple subscripts)
	 * @param res The GMResource to load
	 */
	private async _loadResource(res: IGMResource): Promise<DocResource[]> {
		if (!res.match(this._pattern)) {
			return [];
		}
		if (this._isFolder(res)) {
			return [await this._loadFolder(res)];
		} else if (this._isScript(res)) {
			return this._loadScript(res);
		} else {
			throw new Error(`Unrecognized resource type for resource "${res.name}"`);
		}
	}

	/**
	 * Loads a single GMScript with all the subscripts from disk and extracts
	 * the documentation from it.
	 */
	private async _loadScript(gmScript: GMScript): Promise<DocScript[]> {
		const pathStr = path.resolve(this._gmProject.path, gmScript.filepath);
		try {
			const str = await fse.readFile(pathStr, "utf8");
			gmScript.loadFromString(str);
		} catch (e) {
			throw new Error(`Error loading file ${pathStr}`);
		}
		return this._extractor.extractDocScripts(gmScript);
	}

}
