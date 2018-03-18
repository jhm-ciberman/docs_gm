import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";
import { Container } from "inversify";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import InputFileResolver from "../../../src/renderer/InputFileResolver";
import Design from "../../../src/template/Design";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("InputFileResolverFixture")
export class InputFileResolverFixture {

	@TestCase(DocElementType.Project, "project")
	@TestCase(DocElementType.Folder, "folder")
	@TestCase(DocElementType.Script, "script")
	@TestCase(DocElementType.Resource, "resource")
	@Test()
	public async InputFileResolver_test(type: DocElementType, expected: string) {
		const t = new MockTemplate();
		const design = new Design(t, {
			displayName: "Display name",
			index: "index",
			script: "script",
			folder: "folder",
			resource: "resource",
		});
		const container = new Container();
		const resolver = container.resolve(InputFileResolver);

		Expect(resolver.resolve(design, type)).toBe(expected);
	}

	@TestCase(DocElementType.Project)
	@TestCase(DocElementType.Folder)
	@TestCase(DocElementType.Script)
	@TestCase(DocElementType.Resource)
	@Test()
	public async InputFileResolver_throw(type: DocElementType) {
		const t = new MockTemplate();
		const design = new Design(t, {
			displayName: "Display name",
			index: "",
		});
		const container = new Container();
		const resolver = container.resolve(InputFileResolver);

		Expect(() => resolver.resolve(design, type)).toThrow();
	}

}
