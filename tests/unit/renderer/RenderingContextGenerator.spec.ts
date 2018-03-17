import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import DocScript from "../../../src/doc_models/DocScript";
import { DocElementType } from "../../../src/doc_models/enums/DocElementType";
import IDocElement from "../../../src/doc_models/interfaces/IDocElement";
import ILinkToBuilder from "../../../src/renderer/interfaces/ILinkToBuilder";
import RenderingContextGenerator from "../../../src/renderer/RenderingContextGenerator";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import { TYPES } from "../../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockLinkToBuilder implements ILinkToBuilder {
	public build(_queue: RenderingQueue, _currentPath: string): (e: IDocElement) => string {
		return (_e) => "foo";
	}
}
class MockDocResource extends DocResource {
	public type: DocElementType = DocElementType.Resource;
}
@TestFixture("RenderingContextGeneratorFixture")
export class RenderingContextGeneratorFixture {

	@Test()
	public test_script() {
		const element = new DocScript("my_script");
		const context = this._getContext(element);
		Expect(context.linkTo(element)).toBe("foo");
		Expect(context.script).toBe(element);
	}

	@Test()
	public test_project() {
		const element = new DocProject("my project");
		const context = this._getContext(element);
		Expect(context.linkTo(element)).toBe("foo");
		Expect(context.project).toBe(element);
	}

	@Test()
	public test_folder() {
		const element = new DocFolder("my_folder");
		const context = this._getContext(element);
		Expect(context.linkTo(element)).toBe("foo");
		Expect(context.folder).toBe(element);
	}

	@Test()
	public test_resource() {
		const element = new MockDocResource("my_resource");
		const context = this._getContext(element);
		Expect(context.linkTo(element)).toBe("foo");
		Expect(context.resource).toBe(element);
	}

	private _getContext(element: IDocElement) {
		const container = new Container();
		container.bind<ILinkToBuilder>(TYPES.ILinkToBuilder).to(MockLinkToBuilder);
		const rcg = container.resolve(RenderingContextGenerator);
		return rcg.generate(element, new RenderingQueue(), "");
	}
}
