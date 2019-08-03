import IProjectConfig from "../config/IProjectConfig";
import IGMProject from "../gm_project/IGMProject";

export default interface IDocumentationGenerator {
	generate(project: IGMProject, config?: IProjectConfig): Promise<string>;
}