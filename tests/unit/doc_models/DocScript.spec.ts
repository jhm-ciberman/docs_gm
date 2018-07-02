import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocParam from "../../../src/doc_models/DocParam";
import DocScript from "../../../src/doc_models/DocScript";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocScriptFixture")
export class DocScriptFixture {

	@Test()
	public DocScript_signature() {
		const script = new DocScript("foo");

		const a = new DocParam();
		a.name = "a";
		a.optional = false;

		const b = new DocParam();
		b.name = "b";
		b.optional = false;

		const c = new DocParam();
		c.name = "c";
		c.optional = true;

		script.params.push(a, b, c);

		Expect(script.signature).toBe("foo(a, b, [c]);");
	}

}
