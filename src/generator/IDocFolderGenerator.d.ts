import IGMResource from "../gm_project/IGMResource";
import IGMProject from "../gm_project/IGMProject";
import DocResource from "../doc_models/DocResource";
import IGMFolder from "../gm_project/IGMFolder";
import DocFolder from "../doc_models/DocFolder";
import { IProjectConfig } from "../config/IProjectConfig";
import DocProject from "../doc_models/DocProject";

export default interface IDocFolderGenerator {
	generate(res: IGMFolder, config: IProjectConfig, gmProject: IGMProject, docProject: DocProject): Promise<DocFolder>
}