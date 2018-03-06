import { injectable } from "inversify";
import IScriptValidationRules from "../../src/config/interfaces/IScriptValidationRules";
import DocScript from "../../src/doc_models/DocScript";
import IDocumentationExtractor from "../../src/generator/interfaces/IDocumentationExtractor";
import GMSubscript from "../../src/gm_project/GMSubscript";

/* tslint:disable:completed-docs */

@injectable()
export default class MockDocumentationExtractor implements IDocumentationExtractor {
	public warnUnrecognizedTags: boolean;
	public extractDocScripts(
		_subscriptsIterator: IterableIterator<GMSubscript>,
		_rules: IScriptValidationRules,
		_warnUnrecognizedTags: boolean,
	): DocScript[] {
		throw new Error("Method not implemented.");
	}

}
