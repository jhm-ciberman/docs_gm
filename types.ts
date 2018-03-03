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

	// parser
	IJSDocParser: Symbol.for("IJSDocParser"),

	// Reporter
	IReporter: Symbol.for("IReporter"),

	// Validation
	IScriptValidator: Symbol.for("IScriptValidator"),
	IRuleValidator: Symbol.for("IRuleValidator"),

	// Loader
	IGMProjectLoader: Symbol.for("IGMProjectLoader"),

	// Template
	IModuleFinder: Symbol.for("IModuleFinder"),
	IRenderablePageGenerator: Symbol.for("IRenderablePageGenerator"),
	IPageFeeder: Symbol.for("IPageFeeder"),
	IDesignRenderer: Symbol.for("IDesignRenderer"),
	ITemplateLoader: Symbol.for("ITemplateLoader"),

	// npm modules
	IGetInstalledPath: Symbol.for("IGetInstalledPath"),
};

export {TYPES};
