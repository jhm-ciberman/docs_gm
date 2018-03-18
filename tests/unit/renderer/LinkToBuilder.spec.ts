import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DocScript from "../../../src/doc_models/DocScript";
import LinkToBuilder from "../../../src/renderer/LinkToBuilder";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("LinkToBuilderFixture")
export class LinkToBuilderFixture {

	@TestCase("index.html", "my_script.html")
	@TestCase("dir/index.html", "../my_script.html")
	@Test()
	public test(baseFile: string, expected: string) {
		const element = new DocScript("my_script");

		const container = new Container();
		const linkToBuilder = container.resolve(LinkToBuilder);
		const linkTo = linkToBuilder.build(new RenderingQueue(), baseFile);

		Expect(linkTo(element)).toBe(expected);
		Expect(() => linkTo(null as any)).toThrow();
	}
}
