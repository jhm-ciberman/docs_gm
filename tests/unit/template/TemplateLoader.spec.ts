import {
	Expect,
	Setup,
	SpyOn,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import OutputConfig from "../../../src/config/entities/OutputConfig";
import Design from "../../../src/template/Design";
import IModuleFinder from "../../../src/template/interfaces/IModuleFinder";
import { ITemplate } from "../../../src/template/interfaces/ITemplate";
import ITemplateFactory from "../../../src/template/interfaces/ITemplateFactory";
import { IRoot } from "../../../src/template/interfaces/TemplateJSON";
import TemplateLoader from "../../../src/template/TemplateLoader";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockTemplateFactory implements ITemplateFactory {
	public create(_folder: string, data: IRoot): ITemplate {
		if (data.author !== "Darth Vader") {
			throw new Error("Author is not Darth Vader");
		}
		return new MockTemplate();
	}
}
@injectable()
class MockModuleFinder implements IModuleFinder {
	public async find(moduleName: string): Promise<string> {
		return (moduleName === "docs_gm-foo") ? "foo-folder" : "ERROR";
	}
}
class MockTemplate implements ITemplate {
	public folder: string;
	public author: string | undefined;
	public defaultDesign: Design;
	public description: string | undefined;
	public web: string | undefined;
	public getDesign(_design: string): Design | undefined {
		throw new Error("Method not implemented.");
	}
	public hasDesign(_design: string): boolean {
		throw new Error("Method not implemented.");
	}
	public designs(): IterableIterator<Design> {
		throw new Error("Method not implemented.");
	}
	public findDesign(_designName: string): Design {
		throw new Error("Method not implemented.");
	}
}

const json: IRoot = {
	author: "Darth Vader",
	description: "My description",
	web: "http://myweb.com/",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design name",
			copy: ["aaa"],
			index: "index-foo.njk",
		},
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
		const template = new MockTemplate();

		const tf = new MockTemplateFactory();
		const spy = SpyOn(tf, "create");
		spy.andReturn(template);

		const container = new Container();
		container.bind<ITemplateFactory>(TYPES.ITemplateFactory).toConstantValue(tf);
		container.bind<IModuleFinder>(TYPES.IModuleFinder).to(MockModuleFinder);

		const tl = container.resolve(TemplateLoader);
		const t = await tl.loadFrom(this.folderProject.dir);
		Expect(t).toBe(template);
		Expect(spy).toHaveBeenCalled();
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
		container.bind<ITemplateFactory>(TYPES.ITemplateFactory).to(MockTemplateFactory);
		container.bind<IModuleFinder>(TYPES.IModuleFinder).to(MockModuleFinder);
		return container.resolve(TemplateLoader);
	}

}
