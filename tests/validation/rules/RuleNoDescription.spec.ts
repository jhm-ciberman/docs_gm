import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import RuleNoDescription from "../../../src/validation/rules/RuleNoDescription";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleNoDescription")
export class RuleNoDescriptionFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.description = "foo";

		const rule = new RuleNoDescription();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.description = "";

		const rule = new RuleNoDescription();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleNoDescription();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
