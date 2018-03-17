import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DocScript from "../../../src/doc_models/DocScript";
import LinkToBuilder from "../../../src/renderer/LinkToBuilder";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("LinkToBuilderFixture")
export class LinkToBuilderFixture {

	@Test()
	public test() {
		const element = new DocScript("my_script");

		const queue = new RenderingQueue();
		const linkToScript = queue.linkTo(element);

		const container = new Container();
		const linkToBuilder = container.resolve(LinkToBuilder);
		const linkTo = linkToBuilder.build(queue, "");

		Expect(linkTo(element)).toBe(linkToScript);
		Expect(() => linkTo(null as any)).toThrow();
	}
}
