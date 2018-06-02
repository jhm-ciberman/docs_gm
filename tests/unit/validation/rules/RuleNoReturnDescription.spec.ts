import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocReturns from "../../../../src/doc_models/DocReturns";
import RuleNoReturnDescription from "../../../../src/validation/rules/RuleNoReturnDescription";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleNoReturnDescription")
export class RuleNoReturnDescriptionFixture {

	@Test("RuleNoReturnDescription_isValid")
	public isValid() {
		const vs = new MockValidableScript();
		vs.hasReturn = true;
		vs.doc.returns = new DocReturns();
		vs.doc.returns.description = "foo";

		const rule = new RuleNoReturnDescription();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_noReturn")
	public isValid_noReturn() {
		const vs = new MockValidableScript();
		vs.hasReturn = false;

		const rule = new RuleNoReturnDescription();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		vs.hasReturn = true;
		vs.doc.returns = new DocReturns();
		vs.doc.description = "";

		const rule = new RuleNoReturnDescription();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid_not_null")
	public isValid_not_null() {
		const vs = new MockValidableScript();
		vs.hasReturn = true;
		vs.doc.returns = null;

		const rule = new RuleNoReturnDescription();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleNoReturnDescription();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
