
export interface IProjectConfig {
	name?: string;
	output: IOutputConfig;
	pattern: string;
	root: string;
	parser: IParsingConfig;
	scripts: IScriptValidationRules;
}

export interface IOutputConfig {
	template: string;
	scriptPages: boolean;
	folderPages: boolean;
	outputFolder: string;
	templatesFolder: string;
}

export interface IParsingConfig {
	warnUnrecognizedTags: boolean;
	mergeDuplicateParams: boolean;
}

export interface IScriptValidationRules {
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

export interface IValidationRuleConfig {
	ignore: boolean;
	warn: boolean;
}


