import * as fse from "fs-extra";
import * as path from "path";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocProject from "../doc/models/DocProject";
import DocScript from "../doc/models/DocScript";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IGMScript from "../gm_project/interfaces/IGMScript";
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
	public async generate(project: IGMProject, projectConfig: IProjectConfig): Promise<DocProject> {
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
