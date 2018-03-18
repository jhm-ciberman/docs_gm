import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";
import { Container, injectable } from "inversify";
import DocProject from "../../../src/doc_models/DocProject";
import IDocElement from "../../../src/doc_models/interfaces/IDocElement";
import IRenderingContext from "../../../src/renderer/interfaces/IRenderingContext";
import IRenderingContextGenerator from "../../../src/renderer/interfaces/IRenderingContextGenerator";
import NunjucksRenderer from "../../../src/renderer/NunjucksRenderer";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import Design from "../../../src/template/Design";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockRenderingContextGenerator implements IRenderingContextGenerator {
	public generate(
		project: DocProject,
		_element: IDocElement,
		_queue: RenderingQueue,
		_currentPath: string,
	): IRenderingContext {
		return {project, linkTo: (_e) => "foo"};
	}
}
@TestFixture("NunjucksRendererFixture")
export class NunjucksRendererFixture {

	public folder: TempDir;

	@SetupFixture
	public setup() {
		this.folder = TempDir.create("folder", {
			"index.njk": "Link: {{ linkTo(project.scripts) }}",
		});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest()
	public async test() {
		const container = new Container();
		container.bind<IRenderingContextGenerator>(TYPES.IRenderingContextGenerator).to(MockRenderingContextGenerator);
		const renderer = container.resolve(NunjucksRenderer);

		const template = new MockTemplate();
		template.folder = this.folder.dir;

		const design = new Design(template, {
			displayName: "My design",
			index: "index.njk",
		});

		const p = new DocProject("my-project");

		await renderer.render(design, p, this.folder.dir);

		Expect(this.folder.read("index.html")).toBe("Link: foo");
	}
}
