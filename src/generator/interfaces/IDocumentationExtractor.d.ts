import DocScript from "../../doc_models/DocScript";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";
import IGMScript from "../../gm_project/interfaces/IGMScript";
import GMSubscript from "../../gm_project/GMSubscript";

export default interface IDocumentationExtractor {
	extractDocScripts(subscriptsIterator: IterableIterator<GMSubscript>, rules: IScriptValidationRules, warnUnrecognizedTags: boolean): DocScript[];
}