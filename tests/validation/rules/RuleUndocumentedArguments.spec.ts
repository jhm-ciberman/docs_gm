import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import RuleUndocumentedArguments from "../../../src/validation/rules/RuleUndocumentedArguments";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleUndocumentedArguments")
export class RuleUndocumentedArgumentsFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.params = [];
		vs.argumentCount = 0;

		const rule = new RuleUndocumentedArguments();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.params = [];
		vs.argumentCount = 3;

		const rule = new RuleUndocumentedArguments();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleUndocumentedArguments();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
