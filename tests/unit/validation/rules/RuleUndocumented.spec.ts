import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import RuleUndocumented from "../../../../src/validation/rules/RuleUndocumented";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleUndocumented")
export class RuleUndocumentedFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.undocumented = false;

		const rule = new RuleUndocumented();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.undocumented = true;

		const rule = new RuleUndocumented();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleUndocumented();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
