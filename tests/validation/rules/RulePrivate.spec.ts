import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import RulePrivate from "../../../src/validation/rules/RulePrivate";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RulePrivate")
export class RulePrivateFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.private = false;

		const rule = new RulePrivate();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.private = true;

		const rule = new RulePrivate();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RulePrivate();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
