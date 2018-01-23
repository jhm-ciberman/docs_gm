import IValidationRuleConfig from "./IValidationRuleConfig";

export default interface IScriptValidationRules {
	markUnderscoreScriptsAsPrivate: boolean;
	ignorePrivate: boolean;
	undocumented: IValidationRuleConfig;
	mismatchingFunctionName: IValidationRuleConfig;
	undescripted: IValidationRuleConfig;
	undocumentedArguments: IValidationRuleConfig;
	mismatchingArguments: IValidationRuleConfig;
}
