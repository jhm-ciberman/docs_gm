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

	// Reporter
	IReporter: Symbol.for("IReporter"),

	// Validation
	IScriptValidator: Symbol.for("IScriptValidator"),
	IRuleValidator: Symbol.for("IRuleValidator"),
};

export {TYPES};
