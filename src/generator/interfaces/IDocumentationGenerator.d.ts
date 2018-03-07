import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IGMProject from "../../gm_project/interfaces/IGMProject";

export default interface IDocumentationGenerator {
	generate(project: IGMProject, config?: IProjectConfig): Promise<string>;
}