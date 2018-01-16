import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";
import { TestCase } from "alsatian/core/decorators";
import IValidationRuleConfig from "../config/IValidationRuleConfig";
import { ValidatorRule } from "./ValidatorRule";

/* tslint:disable:max-classes-per-file completed-docs */
@TestFixture("ScriptValidator")
export class ScriptValidatorFixture {

	@TestCase({ignore: true, warn: true}, 1000, true, false)
	@TestCase({ignore: true, warn: true}, -1000, false, true)
	@TestCase({ignore: true, warn: false}, -1000, false, false)
	@Test("validate")
	public test(config: IValidationRuleConfig, n: number, expected: boolean, shouldWarn: boolean) {
		const rule = new ValidatorRule<number>(
			config,
			(e) => e > 10,
			(e) => `warning in number ${e}`,
		);
		Expect(rule.validate(n)).toEqual(expected);
		if (shouldWarn) {
			Expect(ValidatorRule.reporter.warn).toHaveBeenCalledWith(`warning in number ${n}`);
		}
	}
}
