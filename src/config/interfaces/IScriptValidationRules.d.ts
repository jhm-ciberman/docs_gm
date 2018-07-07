import IValidationRuleConfig from "./IValidationRuleConfig";

export default interface IScriptValidationRules {
	markUnderscoreScriptsAsPrivate: boolean;
	ignorePrivate: boolean;
	undocumented: IValidationRuleConfig;
	mismatchingFunctionName: IValidationRuleConfig;
	noDescription: IValidationRuleConfig;
	undocumentedArguments: IValidationRuleConfig;
	mismatchingArguments: IValidationRuleConfig;
	noParamDescription: IValidationRuleConfig;
	noParamType: IValidationRuleConfig;
	functionSignatureInDescription: IValidationRuleConfig;
	noReturnDescription: IValidationRuleConfig;
	noReturnType: IValidationRuleConfig;
	duplicatedParams: IValidationRuleConfig;
}
