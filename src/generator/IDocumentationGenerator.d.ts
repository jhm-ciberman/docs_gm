import IGMProject from "../gm_project/IGMProject";
import { IProjectConfig } from "../config/IProjectConfig";

export default interface IDocumentationGenerator {
	generate(project: IGMProject, config?: IProjectConfig): Promise<string>;
}