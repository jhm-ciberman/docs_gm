import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocReturns from "../../../../src/doc_models/DocReturns";
import RuleNoReturnType from "../../../../src/validation/rules/RuleNoReturnType";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleNoReturnType")
export class RuleNoReturnTypeFixture {

	@Test("isValid_noReturn")
	public isValid_noReturn() {
		const vs = new MockValidableScript();
		vs.doc.returns = null;

		const rule = new RuleNoReturnType();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("RuleNoReturnType_isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.doc.returns = new DocReturns();
		vs.doc.returns.type = "foo";

		const rule = new RuleNoReturnType();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.doc.returns = new DocReturns();
		vs.doc.returns.type = "";

		const rule = new RuleNoReturnType();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleNoReturnType();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
