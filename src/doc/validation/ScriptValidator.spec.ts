import {
	Expect,
	Setup,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";
import ScriptValidationRules from "../../config/ScriptValidationRules";
import DocParam from "../models/DocParam";
import DocScript from "../models/DocScript";
import IValidableScript from "./IValidableScript";
import ScriptValidator from "./ScriptValidator";
import ValidableScript from "./ValidableScript";
import ValidationRule from "./ValidationRule";

/* tslint:disable:max-classes-per-file completed-docs */

class ValidableScriptMock implements IValidableScript {
	public doc: DocScript = new DocScript();
	public argumentCount: number;
	public optionalArguments: boolean;
	public hasReturn: boolean;
}

@TestFixture("ScriptValidator")
export class ScriptValidatorFixture {

	public validator: ScriptValidator;

	public rules: ScriptValidationRules;

	public validable: IValidableScript;
	@Setup
	public setup() {
		this.rules = new ScriptValidationRules();
		this.validator = new ScriptValidator(this.rules);
		this.validable = new ValidableScriptMock();
	}

	@Test("markAsPrivateIfNecesary should mark as private a script staring with underscore")
	public markAsPrivateIfNecesary_mark() {
		this.validable.doc.private = false;
		this.validable.doc.name = "_private_script";
		this.validator.markAsPrivateIfNecesary(this.validable);
		Expect(this.validable.doc.private).toBe(true);
	}

	@Test("markAsPrivateIfNecesary should NOT mark as private a script staring with underscore")
	public markAsPrivateIfNecesary_not_mark() {
		this.validable.doc.private = false;
		this.validable.doc.name = "public_script";
		this.validator.markAsPrivateIfNecesary(this.validable);
		Expect(this.validable.doc.private).toBe(false);
	}

	@Test("rulePrivate should invalidate private scripts")
	public rulePrivate() {
		this.rules.ignorePrivate = true;
		this.validable.doc.private = true;
		const result = this.validator.rulePrivate.validate(this.validable);
		Expect(result).toBe(false);
	}

	@Test("ruleUndocumented should invalidate undocumented scripts")
	public ruleUndocumented() {
		this.validable.doc.undocumented = true;
		this._ValidateAndCheck(this.rules.undocumented, this.validator.ruleUndocumented);
	}

	@Test("ruleUndescripted should invalidate undescripted scripts")
	public ruleUndescripted() {
		this.validable.doc.description = null;
		this._ValidateAndCheck(this.rules.undescripted, this.validator.ruleUndescripted);
	}

	@Test("ruleMismatchingFunctionName should invalidate scripts with a missmatching function name")
	public ruleMismatchingFunctionName() {
		this.validable.doc.name = "my_name";
		this.validable.doc.function = "my_function_name";
		this._ValidateAndCheck(this.rules.mismatchingFunctionName, this.validator.ruleMismatchingFunctionName);
	}

	@Test("ruleMismatchingArguments should invalidate scripts with a missmatching number of arguments")
	public ruleMismatchingArguments() {
		this.validable.doc.params.push(new DocParam());
		this.validable.doc.params.push(new DocParam());
		this.validable.argumentCount = 1;
		this._ValidateAndCheck(this.rules.mismatchingArguments, this.validator.ruleMismatchingArguments);
	}

	@Test("ruleMismatchingArguments should invalidate scripts with a undocumented arguments (all must be undocumented)")
	public ruleUndocumentedArguments() {
		this.validable.argumentCount = 1;
		this._ValidateAndCheck(this.rules.undocumentedArguments, this.validator.ruleUndocumentedArguments);
	}

	private _ValidateAndCheck(ruleConfig: IValidationRuleConfig, validatorRule: ValidationRule<ValidableScript>) {
		ruleConfig.ignore = true;
		ruleConfig.warn = true;
		SpyOn(validatorRule.reporter, "warn");
		const result = validatorRule.validate(this.validable);
		Expect(result).toBe(false);
		Expect(validatorRule.reporter.warn).toHaveBeenCalled();
	}
}
