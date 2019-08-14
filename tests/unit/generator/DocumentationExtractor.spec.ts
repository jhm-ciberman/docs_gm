import {
	Expect,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import { TYPES } from "../../../src/types";

import { IScriptValidationRules } from "../../../src/config/IProjectConfig";
import { ParsingConfig, ScriptValidationRules } from "../../../src/config/ProjectConfig";
import DocScript from "../../../src/doc_models/DocScript";
import DocumentationExtractor from "../../../src/generator/DocumentationExtractor";
import GMSubscript from "../../../src/gm_project/GMSubscript";
import IJSDocParser from "../../../src/parser/IJSDocParser";
import IScriptValidator from "../../../src/validation/interfaces/IScriptValidator";
import IValidableScript from "../../../src/validation/interfaces/IValidableScript";

/* tslint:disable:max-classes-per-file completed-docs */

@injectable()
class MockJSDocParser implements IJSDocParser {
	public parse(name: string, _text: string): DocScript {
		return new DocScript(name);
	}
}
@injectable()
class MockScriptValidator implements IScriptValidator {
	public validate(validable: IValidableScript, _rules: IScriptValidationRules): boolean {
		return validable.doc.name !== "IGNORE_ME";
	}
}

@TestFixture("DocumentationExtractor")
export class DocumentationExtractorFixture {

	@Test("extractDocScripts")
	public extractDocScripts() {

		const scriptValidator = new MockScriptValidator();
		const mockValidate = SpyOn(scriptValidator, "validate");

		const jsDocParser = new MockJSDocParser();
		const mockParse = SpyOn(jsDocParser, "parse");

		const container = new Container();
		container.bind<IScriptValidator>(TYPES.IScriptValidator).toConstantValue(scriptValidator);
		container.bind<IJSDocParser>(TYPES.IJSDocParser).toConstantValue(jsDocParser);
		const extractor = container.resolve(DocumentationExtractor);

		const it = this._mockIteratorFunction();
		const docs = extractor.extractDocScripts(it, new ScriptValidationRules(), new ParsingConfig());

		Expect(docs.length).toBe(2);
		Expect(docs[0].name).toBe("bar"); // scripts are sorted alphabetically
		Expect(docs[1].name).toBe("foo");
		Expect(mockValidate).toHaveBeenCalled();
		Expect(mockParse).toHaveBeenCalled();
	}

	private * _mockIteratorFunction(): IterableIterator<GMSubscript> {
		yield new GMSubscript("foo", "some gml");
		yield new GMSubscript("bar", "some gml");
		yield new GMSubscript("IGNORE_ME", "some gml");
	}
}
