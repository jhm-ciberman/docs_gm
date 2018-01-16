import * as fse from "fs-extra";
import * as path from "path";

import ProjectConfig from "../config/ProjectConfig";
import DocProject from "../docs_models/DocProject";
import DocScript from "../docs_models/DocScript";
import { IGMProject, IGMScript } from "../IGMInterfaces";
import DocumentationExtractor from "./DocumentationExctractor";

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
	public static async generate(project: IGMProject, projectConfig: ProjectConfig): Promise<DocProject> {
		const scripts = project.find(projectConfig.output.pattern)
			.filter((res) => ((res as IGMScript).subScripts !== undefined))
			.sort((a, b) => a.name.localeCompare(b.name)) as IGMScript[];

		if (scripts.length === 0) {
			throw new Error("No resources found");
		}

		const extractor = new DocumentationExtractor(projectConfig);
		const docProject = new DocProject();
		docProject.name = project.name;
		for (const script of scripts) {
			const pathStr = path.resolve(project.path, script.filepath);
			const str = await fse.readFile(pathStr, "utf8");
			script.loadFromString(str);
			const scrArr: DocScript[] = extractor.extractDocScripts(script);
			docProject.scripts = docProject.scripts.concat(scrArr);
		}

		return docProject;
	}
}
