// file types.ts

const TYPES = {
	IValidationRule: Symbol.for("IValidationRule"),
	ICliGenerateFacade: Symbol.for("ICliGenerateFacade"),
	IScriptValidator: Symbol.for("IScriptValidator"),
	IScriptValidationRules: Symbol.for("ScriptValidationRules"),
	IPProjectConfig: Symbol.for("IPRojectConfig"),
	IDocumentationExtractor: Symbol.for("IDocumentationExtractor"),
	IJSDocParser: Symbol.for("IJSDocParser"),
};

export {TYPES};
