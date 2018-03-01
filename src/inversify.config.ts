import { Container, interfaces } from "inversify";
import CliGenerateFacade from "./cli/CliGenerateFacade";
import ICliGenerateFacade from "./cli/ICliGenerateFacade";
import IProjectConfig from "./config/interfaces/IProjectConfig";
import IScriptValidationRules from "./config/interfaces/IScriptValidationRules";
import ProjectConfig from "./config/models/ProjectConfig";
import ScriptValidationRules from "./config/models/ScriptValidationRules";
import DocumentationExtractor from "./generator/DocumentationExtractor";
import IDocumentationExtractor from "./generator/IDocumentationExtractor";
import IJSDocParser from "./parser/IJSDocParser";
import JSDocParser from "./parser/JSDocParser";
import { TYPES } from "./types";
import IScriptValidator from "./validation/IScriptValidator";
import IValidationRule from "./validation/IValidationRule";
import ScriptValidator from "./validation/ScriptValidator";
import ValidableScript from "./validation/ValidableScript";
import ValidationRule from "./validation/ValidationRule";

const container = new Container();

container
	.bind<interfaces.Newable<IValidationRule<ValidableScript>>>(TYPES.IValidationRule)
	.toConstructor(ValidationRule);

container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade)
	.to(CliGenerateFacade);

container.bind<IScriptValidator>(TYPES.IScriptValidator)
	.to(ScriptValidator);

container.bind<IScriptValidationRules>(TYPES.IScriptValidationRules)
	.to(ScriptValidationRules);

container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor)
	.to(DocumentationExtractor);

container.bind<IJSDocParser>(TYPES.IJSDocParser)
	.to(JSDocParser);

container.bind<IProjectConfig>(TYPES.IPProjectConfig)
	.to(ProjectConfig);

export default container;
