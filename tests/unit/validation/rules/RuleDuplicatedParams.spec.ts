import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocParam from "../../../../src/doc_models/DocParam";
import RuleDuplicatedParams from "../../../../src/validation/rules/RuleDuplicatedParams";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleDuplicateParamFixture")
export class RuleDuplicateParamFixture {

	@Test("isValid")
	public isValid() {
		const vs = new MockValidableScript();
		const p1 = new DocParam();
		const p2 = new DocParam();
		p1.name = "arg1";
		p2.name = "arg2";
		vs.doc.params.push(p1, p2);

		const rule = new RuleDuplicatedParams();
		Expect(rule.isValid(vs)).toBe(true);
	}

	@Test("isValid_not")
	public isValid_not() {
		const vs = new MockValidableScript();
		const p1 = new DocParam();
		const p2 = new DocParam();
		p1.name = "arg1";
		p2.name = "arg1";
		vs.doc.params.push(p1, p2);

		const rule = new RuleDuplicatedParams();
		Expect(rule.isValid(vs)).toBe(false);
	}

	@Test("isValid")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		const p1 = new DocParam();
		const p2 = new DocParam();
		p1.name = "arg1";
		p2.name = "arg1";
		vs.doc.params.push(p1, p2);

		const rule = new RuleDuplicatedParams();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
		Expect(str).toContain("arg1");
	}
}
