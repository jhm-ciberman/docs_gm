import { injectable } from "inversify";
import IParsingConfig from "../../../src/config/IParsingConfig";
import IScriptValidationRules from "../../../src/config/IScriptValidationRules";
import DocScript from "../../../src/doc_models/DocScript";
import IDocumentationExtractor from "../../../src/generator/IDocumentationExtractor";
import GMSubscript from "../../../src/gm_project/GMSubscript";

/* tslint:disable:completed-docs */

@injectable()
export default class MockDocumentationExtractor implements IDocumentationExtractor {
	public extractDocScripts(
		_subscriptsIterator: IterableIterator<GMSubscript>,
		_rules: IScriptValidationRules,
		_parsingConfig: IParsingConfig,
	): DocScript[] {
		throw new Error("Method not implemented.");
	}

}
