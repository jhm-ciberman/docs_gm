import IGMScript from "../gm_project/IGMScript";
import IProjectConfig from "../config/IProjectConfig";
import IGMProject from "../gm_project/IGMProject";
import DocScript from "../doc_models/DocScript";

export default interface IScriptLoader {
	load(gmScript: IGMScript, config: IProjectConfig, gmProject: IGMProject): Promise<DocScript[]>;
}
