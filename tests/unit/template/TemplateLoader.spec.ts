import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import { OutputConfig } from "../../../src/config/ProjectConfig";
import IModuleFinder from "../../../src/template/IModuleFinder";
import { IRoot } from "../../../src/template/TemplateJSON";
import TemplateLoader from "../../../src/template/TemplateLoader";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockModuleFinder implements IModuleFinder {
	public async find(moduleName: string): Promise<string> {
		return (moduleName === "docs_gm-foo") ? "foo-folder" : "ERROR";
	}
}

const json: IRoot = {
	author: "Darth Vader",
	description: "My description",
	web: "http://myweb.com/",
	name: "My design name",
	copy: ["aaa"],
	pages: {
		script: "index-foo.njk",
		folder: "index-foo.njk",
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
		});
		this.folderEmpty = TempDir.create("folder", {});

	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("TemplateLoader_load")
	public async TemplateLoader_load() {
		const t = await this._getTL().loadFrom(this.folderProject.dir);
		Expect(t.name).toBe(json.name);
		Expect(t.description).toBe(json.description);
	}

	@Test("TemplateLoader_load")
	public async TemplateLoader_load_error() {
		return this._getTL().loadFrom(this.folderEmpty.dir).then(() => {
			throw new Error("load from not throw");
		}, (e: Error) => {
			Expect(e.message).toContain("Error loading Template from");
		});
	}

	@Test()
	public async TemplateLoader_getFolder_folder() {
		const output = new OutputConfig();
		output.templatesFolder = "my_folder";
		output.template = "foo";
		const folder = await this._getTL().getFolder(output);
		Expect(folder).toContain("my_folder");
		Expect(folder).toContain("foo");
	}

	@Test()
	public async TemplateLoader_getFolder_external() {
		const output = new OutputConfig();
		output.templatesFolder = "";
		output.template = "foo";
		const folder = await this._getTL().getFolder(output);
		Expect(folder).toBe("foo-folder");
	}

	private _getTL() {
		const container = new Container();
		container.bind<IModuleFinder>(TYPES.IModuleFinder).to(MockModuleFinder);
		return container.resolve(TemplateLoader);
	}

}
