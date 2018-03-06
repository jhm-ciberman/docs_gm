import {
	Expect,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import { TYPES } from "../../src/types";

import DocScript from "../../src/doc_models/DocScript";
import IReporter from "../../src/reporter/interfaces/IReporter";
import IValidableScript from "../../src/validation/interfaces/IValidableScript";
import RuleValidator from "../../src/validation/RuleValidator";
import MockReporter from "../__mock__/MockReporter.mock";
import MockRule from "../__mock__/MockRule.mock";

/* tslint:disable:max-classes-per-file completed-docs */

class MockValidableScript implements IValidableScript {
	public argumentCount: number;
	public optionalArguments: boolean;
	public hasReturn: boolean;
	public doc: DocScript;
}
@TestFixture("RuleValidator")
export class RuleValidatorFixture {

	@Test("validate_true")
	public validate_true() {
		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).to(MockReporter);
		const rv = container.resolve(RuleValidator);

		const rule = new MockRule();
		rule.shouldReturn = true;

		const vs = new MockValidableScript();
		Expect(rv.validate(rule, vs, { ignore: false, warn: false })).toBe(true);
	}

	@Test("validate_true")
	public validate_false_warn() {
		const reporter = new MockReporter();
		const warnSpy = SpyOn(reporter, "warn");
		warnSpy.andStub();

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);
		const rv = container.resolve(RuleValidator);

		const rule = new MockRule();
		rule.shouldReturn = false;

		const vs = new MockValidableScript();
		Expect(rv.validate(rule, vs, { ignore: false, warn: true })).toBe(true);
		Expect(rv.validate(rule, vs, { ignore: true, warn: false })).toBe(false);
		// tslint:disable-next-line:no-unused-expression
		Expect(warnSpy).toHaveBeenCalledWith("foo").exactly(1).times;
	}
}
