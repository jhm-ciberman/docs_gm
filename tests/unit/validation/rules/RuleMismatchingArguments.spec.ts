import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocParam from "../../../../src/doc_models/DocParam";
import RuleMismatchingArguments from "../../../../src/validation/rules/RuleMismatchingArguments";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleMismatchingArgumentsFixture")
export class RuleMismatchingArgumentsFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.argumentCount = 3;
		vs.doc.params = [new DocParam(), new DocParam(), new DocParam()];
		const rule = new RuleMismatchingArguments();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.argumentCount = 3;
		vs.doc.params = [new DocParam(), new DocParam()];

		const rule = new RuleMismatchingArguments();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.argumentCount = 2;
		vs.doc.name = "foo";
		vs.doc.params = [new DocParam(), new DocParam(), new DocParam()];

		const rule = new RuleMismatchingArguments();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("2");
		Expect(str).toContain("3");
		Expect(str).toContain("foo");
	}
}
