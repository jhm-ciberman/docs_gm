import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import container from "../../inversify.config";
import { TYPES } from "../../types";

import ScriptValidationRules from "../../src/config/entities/ScriptValidationRules";
import IDocumentationExtractor from "../../src/generator/interfaces/IDocumentationExtractor";
import IGMFolder from "../../src/gm_project/interfaces/IGMFolder";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

/* tslint:disable:max-classes-per-file completed-docs */

class GMScriptMock implements IGMScript {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public filepath: string = "";
	constructor(name: string) {
		this.name = name;
	}
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}

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
		const docs = extractor.extractDocScripts(script, new ScriptValidationRules(), true);
		Expect(docs.length).toBe(2);
	}
}
