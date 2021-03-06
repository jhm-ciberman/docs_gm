import { injectable } from "inversify";
import { IScriptValidationRules, IValidationRuleConfig } from "../config/IProjectConfig";
import { ScriptValidationRules } from "../config/ProjectConfig";
import IRule from "./interfaces/IRule";
import IRulesProvider from "./interfaces/IRulesProvider";
import RuleDuplicateParam from "./rules/RuleDuplicatedParams";
import RuleFunctionSignatureInDescription from "./rules/RuleFunctionSignatureInDescription";
import RuleMismatchingArguments from "./rules/RuleMismatchingArguments";
import RuleMismatchingFunctionName from "./rules/RuleMismatchingFunctionName";
import RuleNoDescription from "./rules/RuleNoDescription";
import RuleNoParamDescription from "./rules/RuleNoParamDescription";
import RuleNoParamType from "./rules/RuleNoParamType";
import RuleNoReturnDescription from "./rules/RuleNoReturnDescription";
import RuleNoReturnType from "./rules/RuleNoReturnType";
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
			new RuleNoParamDescription(),
			new RuleNoParamType(),
			new RuleFunctionSignatureInDescription(),
			new RuleNoReturnDescription(),
			new RuleNoReturnType(),
			new RuleDuplicateParam(),
		];
	}

	public getConfig(rules: IScriptValidationRules): IValidationRuleConfig[] {
		rules = Object.assign(new ScriptValidationRules(), rules);

		return [
			{ warn: false, ignore: rules.ignorePrivate },
			rules.undocumented,
			rules.noDescription,
			rules.mismatchingFunctionName,
			rules.mismatchingArguments,
			rules.undocumentedArguments,
			rules.noParamDescription,
			rules.noParamType,
			rules.functionSignatureInDescription,
			rules.noReturnDescription,
			rules.noReturnType,
			rules.duplicatedParams,
		];
	}
}
