import IGMScript from "../../gm_project/interfaces/IGMScript";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IGMProject from "../../gm_project/interfaces/IGMProject";
import DocScript from "../../doc_models/DocScript";

export default interface IScriptLoader {
	load(gmScript: IGMScript, config: IProjectConfig, gmProject: IGMProject): Promise<DocScript[]>;
}
