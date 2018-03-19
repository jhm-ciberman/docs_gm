import IGMResource from "../../gm_project/interfaces/IGMResource";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IGMProject from "../../gm_project/interfaces/IGMProject";
import DocResource from "../../doc_models/DocResource";
import IGMFolder from "../../gm_project/interfaces/IGMFolder";
import DocFolder from "../../doc_models/DocFolder";

export default interface IDocFolderGenerator {
	generate(res: IGMFolder, config: IProjectConfig, gmProject: IGMProject): Promise<DocFolder>
}