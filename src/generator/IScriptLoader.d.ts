import IGMScript from "../gm_project/IGMScript";
import IGMProject from "../gm_project/IGMProject";
import DocScript from "../doc_models/DocScript";
import { IProjectConfig } from "../config/IProjectConfig";

export default interface IScriptLoader {
	load(gmScript: IGMScript, config: IProjectConfig, gmProject: IGMProject): Promise<DocScript[]>;
}
