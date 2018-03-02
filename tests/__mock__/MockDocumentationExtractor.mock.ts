import { injectable } from "inversify";
import DocScript from "../../src/doc_models/DocScript";
import IDocumentationExtractor from "../../src/generator/interfaces/IDocumentationExtractor";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

/* tslint:disable:completed-docs */

@injectable()
export default class MockDocumentationExtractor implements IDocumentationExtractor {
	public warnUnrecognizedTags: boolean;
	public extractDocScripts(_script: IGMScript): DocScript[] {
		throw new Error("Method not implemented.");
	}
}
