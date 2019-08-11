import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";
import { Container, injectable } from "inversify";
import { IScriptValidationRules, IValidationRuleConfig } from "../../../src/config/IProjectConfig";
import { ScriptValidationRules, ValidationRuleConfig } from "../../../src/config/ProjectConfig";
import DocScript from "../../../src/doc_models/DocScript";
import { TYPES } from "../../../src/types";
import IRule from "../../../src/validation/interfaces/IRule";
import IRulesProvider from "../../../src/validation/interfaces/IRulesProvider";
import IRuleValidator from "../../../src/validation/interfaces/IRuleValidator";
import IValidableScript from "../../../src/validation/interfaces/IValidableScript";
import ScriptValidator from "../../../src/validation/ScriptValidator";
import MockRule from "../__mock__/MockRule.mock";

/* tslint:disable:max-classes-per-file completed-docs */
class MockValidableScript implements IValidableScript {
	public argumentCount: number;
	public optionalArguments: boolean;
	public hasReturn: boolean;
	public doc: DocScript;
}
@injectable()
class MockRulesProvider implements IRulesProvider {
	public getRules(): IRule[] {
		return [new MockRule()];
	}
	public getConfig(_rules: IScriptValidationRules): IValidationRuleConfig[] {
		return [new ValidationRuleConfig(false, true)];
	}
}
@injectable()
class MockRuleValidator implements IRuleValidator {
	public validate(_rule: IRule, _script: IValidableScript, _config: IValidationRuleConfig): boolean {
		return true;
	}
}
@TestFixture("ScriptValidator")
export class ScriptValidatorFixture {

	@Test("validate_true")
	public validate_true() {
		const container = new Container();
		container.bind<IRulesProvider>(TYPES.IRulesProvider).to(MockRulesProvider);
		container.bind<IRuleValidator>(TYPES.IRuleValidator).to(MockRuleValidator);
		const sv = container.resolve(ScriptValidator);

		const vs = new MockValidableScript();
		vs.doc = new DocScript("_foo");
		const r = new ScriptValidationRules();
		r.markUnderscoreScriptsAsPrivate = true;
		Expect(sv.validate(vs, r)).toBe(true);
		Expect(vs.doc.private).toBe(true);
	}

	@Test("validate_not_mark_as_private")
	public validate_not_mark_as_private() {
		const container = new Container();
		container.bind<IRulesProvider>(TYPES.IRulesProvider).to(MockRulesProvider);
		container.bind<IRuleValidator>(TYPES.IRuleValidator).to(MockRuleValidator);
		const sv = container.resolve(ScriptValidator);

		const vs = new MockValidableScript();
		vs.doc = new DocScript("_foo");
		const r = new ScriptValidationRules();
		r.markUnderscoreScriptsAsPrivate = false;
		Expect(sv.validate(vs, r)).toBe(true);
		Expect(vs.doc.private).toBe(false);
	}
}
