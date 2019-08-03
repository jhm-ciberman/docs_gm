import IGMResource from "../gm_project/IGMResource";
import IProjectConfig from "../config/IProjectConfig";
import IGMProject from "../gm_project/IGMProject";
import DocResource from "../doc_models/DocResource";
import IGMFolder from "../gm_project/IGMFolder";
import DocFolder from "../doc_models/DocFolder";

export default interface IDocFolderGenerator {
	generate(res: IGMFolder, config: IProjectConfig, gmProject: IGMProject): Promise<DocFolder>
}