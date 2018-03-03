import DocScript from "../../doc_models/DocScript";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";
import IGMScript from "../../gm_project/interfaces/IGMScript";

export default interface IDocumentationExtractor {
	extractDocScripts(script: IGMScript, rules: IScriptValidationRules, warnUnrecognizedTags: boolean): DocScript[];
}