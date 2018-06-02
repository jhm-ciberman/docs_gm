import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";

import RuleFunctionSignatureInDescription from "../../../../src/validation/rules/RuleFunctionSignatureInDescription";
import RuleMismatchingArguments from "../../../../src/validation/rules/RuleMismatchingArguments";
import MockValidableScript from "./__mock__/MockValidableScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RuleFunctionSignatureInDescription")
export class RuleFunctionSignatureInDescriptionFixture {

	@TestCase("foo", "foo(bar)", false)
	@TestCase("foo", "foo(bar);", false)
	@TestCase("foo", "     foo(bar);    ", false)
	@TestCase("foo", "foo(a, b, c);", false)
	@TestCase("foo", "foo();", false)
	@TestCase("foo", "foo is a great function", true)
	@TestCase("foo", "baz(a, b, c);", true)
	@Test("isValid")
	public isValid(name: string, description: string, expected: boolean) {
		const vs = new MockValidableScript();
		vs.doc.name = name;
		vs.doc.description = description;
		const rule = new RuleFunctionSignatureInDescription();
		Expect(rule.isValid(vs)).toBe(expected);
	}

	@Test("getWarnMessage")
	public getWarnMessage() {
		const vs = new MockValidableScript();
		vs.doc.name = "foo";

		const rule = new RuleMismatchingArguments();
		const str = rule.getWarnMessage(vs);
		Expect(str).toContain("foo");
	}
}
