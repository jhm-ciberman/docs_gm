import {
	Expect,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";
import { TestCase } from "alsatian/core/decorators";
import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";
import ValidationRule from "./ValidationRule";

/* tslint:disable:max-classes-per-file completed-docs */
@TestFixture("ScriptValidator")
export class ScriptValidatorFixture {

	@TestCase({ignore: true, warn: true}, 1000, true, false)
	@TestCase({ignore: true, warn: true}, -1000, false, true)
	@TestCase({ignore: true, warn: false}, -1000, false, false)
	@Test("validate")
	public validate(config: IValidationRuleConfig, n: number, expected: boolean, shouldWarn: boolean) {
		const rule = new ValidationRule<number>(
			config,
			(e) => e > 10,
			(e) => `warning in number ${e}`,
		);
		SpyOn(rule.reporter, "warn");
		Expect(rule.validate(n)).toEqual(expected);
		if (shouldWarn) {
			Expect(rule.reporter.warn).toHaveBeenCalledWith(`warning in number ${n}`);
		}
	}
}
