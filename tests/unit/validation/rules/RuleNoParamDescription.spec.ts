import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocParam from "../../../../src/doc_models/DocParam";
import RuleNoParamDescription from "../../../../src/validation/rules/RuleNoParamDescription";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleNoParamDescriptionFixture")
export class RuleNoParamDescriptionFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		const p1 = new DocParam();
		p1.description = "foo";
		const p2 = new DocParam();
		p2.description = "bar";
		const p3 = new DocParam();
		p3.description = "baz";
		vs.doc.params = [p1, p2, p3];
		const rule = new RuleNoParamDescription();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		const p1 = new DocParam();
		p1.description = "foo";
		const p2 = new DocParam();
		p2.description = ""; // Empty
		const p3 = new DocParam();
		p3.description = "baz";
		vs.doc.params = [p1, p2, p3];

		const rule = new RuleNoParamDescription();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "my_script";
		const p1 = new DocParam();
		p1.name = "script1";
		p1.description = "foo";
		const p2 = new DocParam();
		p2.name = "script2";
		p2.description = ""; // Empty
		const p3 = new DocParam();
		p3.name = "script3";
		p3.description = "baz";
		vs.doc.params = [p1, p2, p3];

		const rule = new RuleNoParamDescription();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("my_script");
		Expect(str).toContain("script2");
		Expect(str).not.toContain("script1");
		Expect(str).not.toContain("script3");
	}
}
