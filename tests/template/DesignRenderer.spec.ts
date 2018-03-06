import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import DocProject from "../../src/doc_models/DocProject";
import DesignRenderer from "../../src/template/DesignRenderer";
import Design from "../../src/template/entities/Design";
import Page from "../../src/template/entities/Page";
import RenderablePage from "../../src/template/entities/RenderablePage";
import { PageFeedWith } from "../../src/template/enums/PageFeedWith";
import IRenderablePageGenerator from "../../src/template/interfaces/IRenderablePageGenerator";
import { ITemplate } from "../../src/template/interfaces/ITemplate";
import { TYPES } from "../../src/types";
import { TempDir } from "../_testing_helpers/TempDir.help";

/* tslint:disable:max-classes-per-file completed-docs */
class MockTemplate implements ITemplate {
	public folder: string;
	public author: string | undefined;
	public defaultDesign: Design = new Design(this, { displayName: "NOT THIS DESIGN", pages: [] });
	public description: string | undefined;
	public web: string | undefined;
	public getDesign(design: string): Design | undefined {
		return (design === "has_this_design")
			? new Design(this, {displayName: "my super design", pages: []})
			: undefined;
	}
	public hasDesign(design: string): boolean {
		return (design === "has_this_design");
	}
	public designs(): IterableIterator<Design> {
		throw new Error("Method not implemented.");
	}
}
@injectable()
class RenderablePageGenerator implements IRenderablePageGenerator {
	public * getPages(page: Page, docProject: DocProject): IterableIterator<RenderablePage> {
		if (page.in === "index.njk" && docProject.name === "my-project") {
			const rp = new RenderablePage();
			rp.encodedData = {page: {project: {name: "World!"}}};
			rp.outputFile = page.out;
			rp.inputFile = page.in;
			yield rp;
		} else {
			throw new Error("Method not implemented.");
		}
	}
}

@TestFixture("DesignRenderer")
export class DesignRendererFixture {

	public folder: TempDir;
	public out: TempDir;

	@SetupFixture
	public setup() {

		this.folder = TempDir.create("folder", {
			"index.njk": "Hello {{ page.project.name }}",
			"my_file.txt": "My file txt",
		});
		this.out = TempDir.create("out", {});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("pageFeeder_allTheScriptsInOnePage")
	public async pageFeeder_allTheScriptsInOnePage() {
		const container = new Container();
		container.bind<IRenderablePageGenerator>(TYPES.IRenderablePageGenerator).to(RenderablePageGenerator);
		const dr = container.resolve(DesignRenderer);

		const template = new MockTemplate();
		template.folder = this.folder.dir;
		const design = new Design(template, {displayName: "design", pages: [
			{in: "index.njk", out: "output.html", feedWith: PageFeedWith.Script},
		]});
		const outputFolder = this.out.dir;
		const str = await dr.render(design, new DocProject("my-project"), outputFolder);
		Expect(str).toBe(outputFolder);
		Expect(this.out.read("output.html")).toBe("Hello World!");
		Expect(this.out.read("my_file.txt")).toBe("My file txt");
	}
}
