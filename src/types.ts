// file types.ts

const TYPES = {
	IValidationRule: Symbol.for("IValidationRule"),
	ICliGenerateFacade: Symbol.for("ICliGenerateFacade"),
	IScriptValidator: Symbol.for("IScriptValidator"),
	IScriptValidationRules: Symbol.for("ScriptValidationRules"),
	IProjectConfig: Symbol.for("IProjectConfig"),
	IDocumentationExtractor: Symbol.for("IDocumentationExtractor"),
	IJSDocParser: Symbol.for("IJSDocParser"),
	IDocProjectGenerator: Symbol.for("IDocProjectGenerator"),
	IGMProject: Symbol.for("IGMProject"),
	IOutputConfig: Symbol.for("IOutputConfig"),
	NewableOfIProjectConfig: Symbol.for("Newable<IProjectConfig>"),
	IConfigManager: Symbol.for("IConfigManager"),
};

export {TYPES};
