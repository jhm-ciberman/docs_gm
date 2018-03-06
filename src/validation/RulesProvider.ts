import { injectable } from "inversify";
import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import IRule from "./interfaces/IRule";
import IRulesProvider from "./interfaces/IRulesProvider";
import RuleMismatchingArguments from "./rules/RuleMismatchingArguments";
import RuleMismatchingFunctionName from "./rules/RuleMismatchingFunctionName";
import RuleNoDescription from "./rules/RuleNoDescription";
import RulePrivate from "./rules/RulePrivate";
import RuleUndocumented from "./rules/RuleUndocumented";
import RuleUndocumentedArguments from "./rules/RuleUndocumentedArguments";

@injectable()
export default class RulesProvider implements IRulesProvider {
	public getRules(): IRule[] {
		return [
			new RulePrivate(),
			new RuleUndocumented(),
			new RuleNoDescription(),
			new RuleMismatchingFunctionName(),
			new RuleMismatchingArguments(),
			new RuleUndocumentedArguments(),
		];
	}

	public getConfig(rules: IScriptValidationRules): IValidationRuleConfig[] {
		return [
			{ warn: false, ignore: rules.ignorePrivate },
			rules.undocumented,
			rules.noDescription,
			rules.mismatchingFunctionName,
			rules.mismatchingArguments,
			rules.undocumentedArguments,
		];
	}
}
