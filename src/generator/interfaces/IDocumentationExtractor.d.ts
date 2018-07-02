import DocScript from "../../doc_models/DocScript";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";
import IGMScript from "../../gm_project/interfaces/IGMScript";
import GMSubscript from "../../gm_project/GMSubscript";
import IParsingConfig from "../../config/interfaces/IParsingConfig";

export default interface IDocumentationExtractor {
	extractDocScripts(subscriptsIterator: IterableIterator<GMSubscript>, rules: IScriptValidationRules, parsingConfig: IParsingConfig): DocScript[];
}