// file types.ts

const TYPES = {
	// Cli
	ICliGenerateFacade: Symbol.for("ICliGenerateFacade"),

	// Config
	IConfigManager: Symbol.for("IConfigManager"),

	// generator
	IDocumentationExtractor: Symbol.for("IDocumentationExtractor"),
	IDocProjectGenerator: Symbol.for("IDocProjectGenerator"),

	// parser
	IJSDocParser: Symbol.for("IJSDocParser"),

	// Rules
	RuleMismatchingArguments: Symbol.for("RuleMismatchingArguments"),
	RuleMismatchingFunctionName: Symbol.for("RuleMismatchingFunctionName"),
	RuleNoDescription: Symbol.for("RuleNoDescription"),
	RulePrivate: Symbol.for("RulePrivate"),
	RuleUndocumented: Symbol.for("RuleUndocumented"),
	RuleUndocumentedArguments: Symbol.for("RuleUndocumentedArguments"),

	// Validation
	IScriptValidator: Symbol.for("IScriptValidator"),
};

export {TYPES};
