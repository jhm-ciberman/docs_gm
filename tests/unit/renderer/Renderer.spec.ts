import {
	Expect,
	SpyOn,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocScript from "../../../src/doc_models/DocScript";
import Page from "../../../src/renderer/Page";
import Renderer from "../../../src/renderer/Renderer";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import IReporter from "../../../src/reporter/IReporter";
import Template from "../../../src/template/Template";
import { IRoot } from "../../../src/template/TemplateJSON";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockReporter from "../__mock__/MockReporter.mock";

const json: IRoot = {
	author: "Darth Vader",
	description: "My description",
	web: "http://myweb.com/",
	name: "My template name",
	copy: ["aaa"],
	pages: {
		script: "script-foo.njk",
		folder: "folder-foo.njk",
	},
};

@TestFixture()
export class RendererFixture {

	public templateDir: TempDir;
	public outputFolder: TempDir;

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test()
	public async render() {
		this.templateDir = TempDir.create("folder", {
			"template.json": JSON.stringify(json),
			"folder-foo.njk": "{{ project.name }} <b>{{ folder.name }}</b> {{ linkTo(folder.children[0]) }}",
			"script-foo.njk": "{{ project.name }} <b>{{ script.name }}</b> {{ asset('my-foo-asset') }} ",
		});
		this.outputFolder = TempDir.create("folder", {});

		const template = new Template(this.templateDir.dir, json);
		const queue = this._createRenderingQueue();

		await this._getRenderer().render(template, queue, this.outputFolder.dir);

		const htmlScript = this.outputFolder.read("my_script.html");
		Expect(htmlScript).toContain("my_script");
		Expect(htmlScript).toContain("my project");

		const htmlIndex = this.outputFolder.read("index.html");
		Expect(htmlIndex).toContain("my_folder");
		Expect(htmlIndex).toContain("my project");
		Expect(htmlIndex).toContain("my_script.html");
	}

	@Test()
	public async renderShouldThrowWhenTemplateDoesNotSupportsType() {
		const template = new Template(this.templateDir.dir, json);
		json.pages.folder = undefined as any;
		const queue = this._createRenderingQueue();

		Expect(() => this._getRenderer().render(template, queue, this.outputFolder.dir)).toThrowAsync();
	}

	private _getRenderer() {
		const reporter = new MockReporter();
		SpyOn(reporter, "info").andStub();

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);

		return container.resolve(Renderer);
	}

	private _createRenderingQueue() {
		const queue = new RenderingQueue();
		const project = new DocProject("my project");
		project.root = new DocFolder("my_folder", project);
		const script = new DocScript("my_script", project);
		script.parent = project.root;
		project.root.children.push(script);
		queue.addPage(new Page(project.root));
		queue.addPage(new Page(script));
		return queue;
	}
}
