import {
	Expect,
	SetupFixture,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import NunjucksTemplateLookup from "../../../src/renderer/NunjucksTemplateLookup";
import Design from "../../../src/template/Design";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RenderingQueueFixture")
export class RenderingQueueFixture {

	public folder: TempDir;

	@SetupFixture
	public setup() {
		this.folder = TempDir.create("folder", {
			"a.njk": "Hello {{ foo }}",
		});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@Test()
	public test() {
		const template = new MockTemplate();
		template.folder = this.folder.dir;

		const design = new Design(template, {
			displayName: "My design",
			index: "a.njk",
			folder: "a.njk",
		});
		const ntl = new NunjucksTemplateLookup(design);
		const nunjucksTemplate1 = ntl.get(DocElementType.Folder);
		const nunjucksTemplate2 = ntl.get(DocElementType.Folder);
		const str = nunjucksTemplate1.render({foo: "World"});
		Expect(str).toBe("Hello World");
		Expect(nunjucksTemplate1).toBe(nunjucksTemplate2);
	}
}
