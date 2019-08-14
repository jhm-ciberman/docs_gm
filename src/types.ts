// file types.ts

const TYPES = {
	// Other
	ISchemaValidator: Symbol.for("ISchemaValidator"),

	// Cli
	ICliGenerateFacade: Symbol.for("ICliGenerateFacade"),

	// Config
	IConfigManager: Symbol.for("IConfigManager"),
	IConfigOverrider: Symbol.for("IConfigOverrider"),

	// generator
	IDocumentationExtractor: Symbol.for("IDocumentationExtractor"),
	IDocFolderGenerator: Symbol.for("IDocFolderGenerator"),
	IDocumentationGenerator: Symbol.for("IDocumentationGenerator"),
	IScriptLoader: Symbol.for("IScriptLoader"),
	IProjectRootFinder: Symbol.for("IProjectRootFinder"),

	// parser
	IJSDocParser: Symbol.for("IJSDocParser"),

	// Rendering
	INunjucksRenderer: Symbol.for("INunjucksRenderer"),
	IDesignFilesCopier: Symbol.for("IDesignFilesCopier"),
	ILinkToBuilder: Symbol.for("ILinkToBuilder"),

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
	IPkgDir: Symbol.for("IPkgDir"),
};

export {TYPES};
