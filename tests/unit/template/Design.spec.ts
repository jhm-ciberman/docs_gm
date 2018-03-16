import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import Design from "../../../src/template/Design";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DesignFixture")
export class DesignFixture {

	@TestCase(DocElementType.Project, "project")
	@TestCase(DocElementType.Folder, "folder")
	@TestCase(DocElementType.Script, "script")
	@TestCase(DocElementType.Resource, "resource")
	@Test()
	public async Design_getInputFile(type: DocElementType, expected: string) {
		const t = new MockTemplate();
		const d = new Design(t, {
			displayName: "Display name",
			index: "index",
			script: "script",
			folder: "folder",
			resource: "resource",
		});

		Expect(d.getInputFile(type)).toBe(expected);
	}

}
