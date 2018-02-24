import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import ProjectConfig from "../config/models/ProjectConfig";
import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IGMScript from "../gm_project/interfaces/IGMScript";
import DocumentationExtractor from "./DocumentationExctractor";
/* tslint:disable:max-classes-per-file completed-docs */

class GMScriptMock implements IGMScript {
	public filepath: string = "";
	public parent: IGMFolder | null = null;
	public fullpath: string = "";
	public name: string = "";
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
		const config = new ProjectConfig();
		const extractor = new DocumentationExtractor(config);
		const script = new GMScriptMock();
		const docs = extractor.extractDocScripts(script);
		Expect(docs.length).toBe(2);
	}
}
