import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import RuleMismatchingFunctionName from "../../../../src/validation/rules/RuleMismatchingFunctionName";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleMismatchingFunctionName")
export class RuleMismatchingFunctionNameFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.function = "foo";
		vs.doc.name = "foo";

		const rule = new RuleMismatchingFunctionName();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.function = "foo";
		vs.doc.name = "bar";

		const rule = new RuleMismatchingFunctionName();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";
		vs.doc.function = "bar";

		const rule = new RuleMismatchingFunctionName();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
		Expect(str).toContain("bar");
	}
}
