import {
	AsyncTest,
	Expect,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import Design from "../../../src/template/entities/Design";
import { PageFeedWith } from "../../../src/template/enums/PageFeedWith";
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
			pages: [{
				in: "foo",
				out: "bar",
				feedWith: PageFeedWith.Scripts,
			}],
		},
	},
};

@TestFixture("TemplateLoader")
export class TemplateLoaderFixture {

	public folderProject: TempDir;
	public folderEmpty: TempDir;

	@SetupFixture
	public setup() {

		this.folderProject = TempDir.create("folder", {
			"template.json": JSON.stringify(json),
		});
		this.folderEmpty = TempDir.create("folder", {});

	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("TemplateLoader_load")
	public async TemplateLoader_load() {
		const template = new MockTemplate();

		const tf = new MockTemplateFactory();
		const spy = SpyOn(tf, "create");
		spy.andReturn(template);

		const container = new Container();
		container.bind<ITemplateFactory>(TYPES.ITemplateFactory).toConstantValue(tf);

		const tl = container.resolve(TemplateLoader);
		const t = await tl.loadFrom(this.folderProject.dir);
		Expect(t).toBe(template);
		Expect(spy).toHaveBeenCalled();
	}

	@AsyncTest("TemplateLoader_load")
	public async TemplateLoader_load_error() {
		const container = new Container();
		container.bind<ITemplateFactory>(TYPES.ITemplateFactory).to(MockTemplateFactory);
		const tl = container.resolve(TemplateLoader);
		Expect(async () => tl.loadFrom(this.folderEmpty.dir)).toThrowAsync();
	}

}
