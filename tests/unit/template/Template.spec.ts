import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";
import { IRoot } from "../../../src/template/TemplateJSON";
import Template from "../../../src/template/Template";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import { DocResourceType } from "../../../src/doc_models/DocResourceType";

const json: IRoot = {
	author: "Darth Vader",
	description: "My description",
	web: "http://myweb.com/",
	name: "My design name",
	copy: ["**/*.txt"],
	pages: {
		script: "script-foo.njk",
		folder: "folder-foo.njk",
	},
};

@TestFixture("TemplateLoader")
export class TemplateLoaderFixture {

	public folderProject: TempDir;
	public folderEmpty: TempDir;

	@Setup
	public setup() {

		this.folderProject = TempDir.create("folder", {
			"template.json": JSON.stringify(json),
			"foo.txt": "foo",
		});
		this.folderEmpty = TempDir.create("folder", {});

	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test()
	public getTemplatePathFor() {
		const template = new Template(this.folderProject.dir, json);

		Expect(template.getTemplatePathFor(DocResourceType.Folder)).toBe("folder-foo.njk");
		Expect(template.getTemplatePathFor(DocResourceType.Script)).toBe("script-foo.njk");
		Expect(() => template.getTemplatePathFor(DocResourceType.Resource)).toThrow();
	}

	@Test()
	public async copyFiles() {
		const template = new Template(this.folderProject.dir, json);

		await template.copyFiles(this.folderEmpty.dir);

		Expect(this.folderEmpty.read("foo.txt")).toBe("foo");
	}
}
