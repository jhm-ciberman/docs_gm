import {
	AsyncTest,
	Expect,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	TestFixture,
} from "alsatian";
import { Container, injectable } from "inversify";
import DocProject from "../../../src/doc_models/DocProject";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import IDocElement from "../../../src/doc_models/interfaces/IDocElement";
import IInputFileResolver from "../../../src/renderer/interfaces/IInputFileResolver";
import ILinkToBuilder from "../../../src/renderer/interfaces/ILinkToBuilder";
import IRenderingContext from "../../../src/renderer/interfaces/IRenderingContext";
import IRenderingContextGenerator from "../../../src/renderer/interfaces/IRenderingContextGenerator";
import NunjucksRenderer from "../../../src/renderer/NunjucksRenderer";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import IReporter from "../../../src/reporter/interfaces/IReporter";
import Design from "../../../src/template/Design";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockReporter from "../__mock__/MockReporter.mock";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockRenderingContextGenerator implements IRenderingContextGenerator {
	public generate(project: DocProject, _element: IDocElement): IRenderingContext {
		return {project};
	}
}
@injectable()
class MockLinkToBuilder implements ILinkToBuilder {
	public build(_queue: RenderingQueue, _currentFile: string): (e: IDocElement) => string {
		return (_e) => "foo";
	}
}
@injectable()
class MockInputFileResolver implements IInputFileResolver {
	public resolve(design: Design, _type: DocElementType): string {
		return design.index;
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
	public async NunjucksRenderer_test() {
		const mockReporter = new MockReporter();
		SpyOn(mockReporter, "info").andStub();

		const container = new Container();
		container.bind<IRenderingContextGenerator>(TYPES.IRenderingContextGenerator).to(MockRenderingContextGenerator);
		container.bind<IInputFileResolver>(TYPES.IInputFileResolver).to(MockInputFileResolver);
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(mockReporter);
		container.bind<ILinkToBuilder>(TYPES.ILinkToBuilder).to(MockLinkToBuilder);
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
