import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import DocScript from "../../../src/doc_models/DocScript";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import IDocElement from "../../../src/doc_models/interfaces/IDocElement";
import IRenderingContext from "../../../src/renderer/interfaces/IRenderingContext";
import RenderingContextGenerator from "../../../src/renderer/RenderingContextGenerator";

/* tslint:disable:max-classes-per-file completed-docs */
class MockDocResource extends DocResource {
	public type: DocElementType = DocElementType.Resource;
}
@TestFixture("RenderingContextGeneratorFixture")
export class RenderingContextGeneratorFixture {

	@Test()
	public test_script() {
		const project = new DocProject("my project");
		const element = new DocScript("my_script");
		const context = this._getContext(project, element);
		Expect(context.project).toBe(project);
		Expect(context.script).toBe(element);
	}

	@Test()
	public test_project() {
		const project = new DocProject("my project");
		const context = this._getContext(project, project);
		Expect(context.project).toBe(project);
	}

	@Test()
	public test_folder() {
		const project = new DocProject("my project");
		const element = new DocFolder("my_folder");
		const context = this._getContext(project, element);
		Expect(context.project).toBe(project);
		Expect(context.folder).toBe(element);
	}

	@Test()
	public test_resource() {
		const project = new DocProject("my project");
		const element = new MockDocResource("my_resource");
		const context = this._getContext(project, element);
		Expect(context.project).toBe(project);
		Expect(context.resource).toBe(element);
	}

	private _getContext(project: DocProject, element: IDocElement): IRenderingContext {
		const container = new Container();
		const rcg = container.resolve(RenderingContextGenerator);
		return rcg.generate(project, element);
	}
}
