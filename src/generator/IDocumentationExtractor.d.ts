import DocScript from "../doc_models/DocScript";
import IGMScript from "../gm_project/IGMScript";
import GMSubscript from "../gm_project/GMSubscript";
import { IScriptValidationRules, IParsingConfig } from "../config/IProjectConfig";

export default interface IDocumentationExtractor {
	extractDocScripts(subscriptsIterator: IterableIterator<GMSubscript>, rules: IScriptValidationRules, parsingConfig: IParsingConfig): DocScript[];
}