import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import container from "../inversify.config";
import { TYPES } from "../types";

import GMScript from "../gm_project/GMScript";
import IDocumentationExtractor from "./interfaces/IDocumentationExtractor";
/* tslint:disable:max-classes-per-file completed-docs */

class GMScriptMock extends GMScript {
	public filepath: string = "";
	public * subScripts(): IterableIterator<[string, string]> {
		const script1 = [
			"/**",
			" * Description1 ",
			" */",
		];
		yield ["my_script1", script1.join("\n")];
		const script2 = [
			"/**",
			" * Description2 ",
			" */",
		];
		yield ["my_script2", script2.join("\n")];
		yield ["my_script3", "a = b"]; // Undocumented script should be ignored
	}
	public loadFromString(_str: string): void {
		throw new Error("Method not implemented.");
	}
}

@TestFixture("DocumentationExtractor")
export class DocumentationExtractorFixture {

	@Test("extractDocScripts")
	public extractDocScripts() {
		const extractor = container.get<IDocumentationExtractor>(TYPES.IDocumentationExtractor);
		const script = new GMScriptMock("foo");
		const docs = extractor.extractDocScripts(script);
		Expect(docs.length).toBe(2);
	}
}
