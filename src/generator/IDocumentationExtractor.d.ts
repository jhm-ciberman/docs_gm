import DocScript from "../doc_models/DocScript";
import IProjectConfig from "../config/IProjectConfig";
import IScriptValidationRules from "../config/IScriptValidationRules";
import IGMScript from "../gm_project/IGMScript";
import GMSubscript from "../gm_project/GMSubscript";
import IParsingConfig from "../config/IParsingConfig";

export default interface IDocumentationExtractor {
	extractDocScripts(subscriptsIterator: IterableIterator<GMSubscript>, rules: IScriptValidationRules, parsingConfig: IParsingConfig): DocScript[];
}