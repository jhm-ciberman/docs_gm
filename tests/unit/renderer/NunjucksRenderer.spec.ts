import {
	Expect,
	Setup,
	SpyOn,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";
import { Container, injectable } from "inversify";
import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import ILinkToBuilder from "../../../src/renderer/ILinkToBuilder";
import NunjucksRenderer from "../../../src/renderer/NunjucksRenderer";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import IReporter from "../../../src/reporter/IReporter";
import Design from "../../../src/template/Design";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockReporter from "../__mock__/MockReporter.mock";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockLinkToBuilder implements ILinkToBuilder {
	public build(_queue: RenderingQueue, _currentFile: string): (e: DocResource) => string {
		return (_e) => "foo";
	}
}
@TestFixture("NunjucksRendererFixture")
export class NunjucksRendererFixture {

	public folder: TempDir;

	@Setup
	public setup() {
		this.folder = TempDir.create("folder", {
			"folder.njk": "Link: {{ linkTo(project.scripts) }}",
		});
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test()
	public async NunjucksRenderer_test() {
		const mockReporter = new MockReporter();
		SpyOn(mockReporter, "info").andStub();

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(mockReporter);
		container.bind<ILinkToBuilder>(TYPES.ILinkToBuilder).to(MockLinkToBuilder);
		const renderer = container.resolve(NunjucksRenderer);

		const template = new MockTemplate();
		template.folder = this.folder.dir;

		const design = new Design(template, {
			displayName: "My design",
			index: "folder.njk",
		});

		const p = new DocProject("my-project");

		await renderer.render(design, p, this.folder.dir);

		Expect(this.folder.read("index.html")).toBe("Link: foo");
	}
}
