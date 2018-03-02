import DocScript from "../../doc_models/DocScript";
import GMScript from "../../gm_project/GMScript";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";

export default interface IDocumentationExtractor {
	extractDocScripts(script: GMScript, rules: IScriptValidationRules, warnUnrecognizedTags: boolean): DocScript[];
}