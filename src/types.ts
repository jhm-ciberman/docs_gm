// file types.ts

const TYPES = {
	// Cli
	ICliGenerateFacade: Symbol.for("ICliGenerateFacade"),

	// Config
	IConfigManager: Symbol.for("IConfigManager"),

	// generator
	IDocumentationExtractor: Symbol.for("IDocumentationExtractor"),
	IDocProjectGenerator: Symbol.for("IDocProjectGenerator"),
	IDocumentationGenerator: Symbol.for("IDocumentationGenerator"),
	IScriptLoader: Symbol.for("IScriptLoader"),

	// parser
	IJSDocParser: Symbol.for("IJSDocParser"),

	// Rendering
	IRenderingContextGenerator: Symbol.for("IRenderingContextGenerator"),
	INunjucksRenderer: Symbol.for("INunjucksRenderer"),
	IDesignFilesCopier: Symbol.for("IDesignFilesCopier"),

	// Reporter
	IReporter: Symbol.for("IReporter"),

	// Validation
	IScriptValidator: Symbol.for("IScriptValidator"),
	IRuleValidator: Symbol.for("IRuleValidator"),
	IRulesProvider: Symbol.for("IRulesProvider"),

	// Loader
	IGMProjectLoader: Symbol.for("IGMProjectLoader"),

	// Template
	IModuleFinder: Symbol.for("IModuleFinder"),
	ITemplateLoader: Symbol.for("ITemplateLoader"),
	ITemplateFactory: Symbol.for("ITemplateFactory"),
	IFilesCopier: Symbol.for("IFilesCopier"),

	// npm modules
	IGetInstalledPath: Symbol.for("IGetInstalledPath"),
	IOpen: Symbol.for("IOpen"),
};

export {TYPES};
