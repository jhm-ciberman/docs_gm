import {
	Expect,
	Setup,
	SpyOn,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import ScriptValidationRules from "../config/models/ScriptValidationRules";
import DocParam from "../doc_models/DocParam";
import DocScript from "../doc_models/DocScript";
import container from "../inversify.config";
import { TYPES } from "../types";
import IScriptValidator from "./IScriptValidator";
import IValidableScript from "./IValidableScript";
import IValidationRule from "./IValidationRule";
import ValidableScript from "./ValidableScript";

/* tslint:disable:max-classes-per-file completed-docs */

class ValidableScriptMock implements IValidableScript {
	public doc: DocScript = new DocScript("foo");
	public argumentCount: number;
	public optionalArguments: boolean;
	public hasReturn: boolean;
}

@TestFixture("ScriptValidator")
export class ScriptValidatorFixture {

	public validator: IScriptValidator;

	public rules: IScriptValidationRules;

	public validable: IValidableScript;

	@Setup
	public setup() {
		container.snapshot();
		this.rules = new ScriptValidationRules();
		container.unbind(TYPES.IScriptValidationRules);
		container.bind<IScriptValidationRules>(TYPES.IScriptValidationRules).toConstantValue(this.rules);

		this.validator = container.get<IScriptValidator>(TYPES.IScriptValidator);
		this.validable = new ValidableScriptMock();
	}

	@Teardown
	public teardown() {
		container.restore();
	}

	@Test("markAsPrivateIfNecessary should mark as private a script staring with underscore")
	public markAsPrivateIfNecessary_mark() {
		this.validable.doc.private = false;
		this.validable.doc.name = "_private_script";
		this.validator.markAsPrivateIfNecessary(this.validable);
		Expect(this.validable.doc.private).toBe(true);
	}

	@Test("markAsPrivateIfNecessary should NOT mark as private a script staring with underscore")
	public markAsPrivateIfNecessary_not_mark() {
		this.validable.doc.private = false;
		this.validable.doc.name = "public_script";
		this.validator.markAsPrivateIfNecessary(this.validable);
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
		this._shouldInvalidateAndWarn(this.rules.undocumented, this.validator.ruleUndocumented);
	}

	@Test("ruleUndescripted should invalidate undescripted scripts")
	public ruleUndescripted() {
		this.validable.doc.description = null;
		this._shouldInvalidateAndWarn(this.rules.undescripted, this.validator.ruleUndescripted);
	}

	@Test("ruleMismatchingFunctionName should invalidate scripts with a missmatching function name")
	public ruleMismatchingFunctionName() {
		this.validable.doc.name = "my_name";
		this.validable.doc.function = "my_function_name";
		this._shouldInvalidateAndWarn(this.rules.mismatchingFunctionName, this.validator.ruleMismatchingFunctionName);
	}

	@Test("ruleMismatchingArguments should invalidate scripts with a missmatching number of arguments")
	public ruleMismatchingArguments() {
		this.validable.doc.params.push(new DocParam());
		this.validable.doc.params.push(new DocParam());
		this.validable.argumentCount = 1;
		this._shouldInvalidateAndWarn(this.rules.mismatchingArguments, this.validator.ruleMismatchingArguments);
	}

	@Test("ruleMismatchingArguments should invalidate scripts with a undocumented arguments (all must be undocumented)")
	public ruleUndocumentedArguments_invalidate() {
		this.validable.argumentCount = 1;
		this._shouldInvalidateAndWarn(this.rules.undocumentedArguments, this.validator.ruleUndocumentedArguments);
	}

	@Test("ruleMismatchingArguments should validate scripts if they have zero arguments")
	public ruleUndocumentedArguments_validate() {
		this.validable.doc.params = [];
		this.validable.argumentCount = 0;
		this.rules.undocumentedArguments.ignore = true;
		this.rules.undocumentedArguments.warn = true;
		const validatorRule = this.validator.ruleUndocumentedArguments;
		SpyOn(validatorRule.reporter, "warn");
		const result = validatorRule.validate(this.validable);
		Expect(result).toBe(true);
		Expect(validatorRule.reporter.warn).not.toHaveBeenCalled();
	}

	private _shouldInvalidateAndWarn(ruleConfig: IValidationRuleConfig, validatorRule: IValidationRule<ValidableScript>) {
		ruleConfig.ignore = true;
		ruleConfig.warn = true;
		SpyOn(validatorRule.reporter, "warn");
		const result = validatorRule.validate(this.validable);
		Expect(result).toBe(false);
		Expect(validatorRule.reporter.warn).toHaveBeenCalled();
	}
}
