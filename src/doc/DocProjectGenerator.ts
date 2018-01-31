import * as fse from "fs-extra";
import * as path from "path";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IGMScript from "../gm_project/interfaces/IGMScript";

import DocumentationExtractor from "./DocumentationExctractor";
import DocProject from "./models/DocProject";
import DocScript from "./models/DocScript";

/**
 * This class generates a DocProject
 */
export default class DocProjectGenerator {
	/**
	 * Generates a DocProject filled with all the documentable resources of the
	 * given project (following the ProjectConfig)
	 * @param project The GM Project
	 * @param config The OutputConfig
	 */
	public async generate(project: IGMProject, projectConfig: IProjectConfig): Promise<DocProject> {
		const scripts = this._getScripts(project, projectConfig.output.pattern);
		const extractor = new DocumentationExtractor(projectConfig);
		const docProject = new DocProject();
		docProject.name = project.name;
		for (const script of scripts) {
			const pathStr = path.resolve(project.path, script.filepath);
			try {
				const str = await fse.readFile(pathStr, "utf8");
				script.loadFromString(str);
			} catch (e) {
				throw new Error(`Error loading file ${pathStr}`);
			}
			const scrArr: DocScript[] = extractor.extractDocScripts(script);
			docProject.scripts = docProject.scripts.concat(scrArr);
		}
		return docProject;
	}

	/**
	 * Returns a list of IGMScripts
	 * @param project The project that contains the scripts
	 * @param pattern The glob pattern to filter the scripts
	 */
	private _getScripts(project: IGMProject, pattern: string): IGMScript[] {
		// Find all the project resources that match the input pattern
		const resources = project.find(pattern);

		// Filter scripts (ducktyping for the subScripts method)
		const scripts = resources.filter((res) => ((res as IGMScript).subScripts !== undefined));

		if (scripts.length === 0) {
			throw new Error("No resources found");
		}

		return scripts as IGMScript[];
	}
}
