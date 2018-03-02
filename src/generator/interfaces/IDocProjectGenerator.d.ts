import DocProject from "../../doc_models/DocProject";
import IGMProject from "../../gm_project/interfaces/IGMProject";
import IProjectConfig from "../../config/interfaces/IProjectConfig";

export default interface IDocProjectGenerator {
	generate(gmProject: IGMProject, config: IProjectConfig): Promise<DocProject>
}