import { Container, interfaces } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "./cli/CliGenerateFacade";
import ICliGenerateFacade from "./cli/interfaces/ICliGenerateFacade";

import ConfigManager from "./config/ConfigManager";
import IConfigManager from "./config/interfaces/IConfigManager";
import IOutputConfig from "./config/interfaces/IOutputConfig";
import IProjectConfig from "./config/interfaces/IProjectConfig";
import IScriptValidationRules from "./config/interfaces/IScriptValidationRules";
import OutputConfig from "./config/OutputConfig";
import ProjectConfig from "./config/ProjectConfig";
import ScriptValidationRules from "./config/ScriptValidationRules";

import DocProjectGenerator from "./generator/DocProjectGenerator";
import DocumentationExtractor from "./generator/DocumentationExtractor";
import IDocProjectGenerator from "./generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "./generator/interfaces/IDocumentationExtractor";

import IJSDocParser from "./parser/interfaces/IJSDocParser";
import JSDocParser from "./parser/JSDocParser";

import IScriptValidator from "./validation/interfaces/IScriptValidator";
import IValidationRule from "./validation/interfaces/IValidationRule";
import ScriptValidator from "./validation/ScriptValidator";
import ValidableScript from "./validation/ValidableScript";
import ValidationRule from "./validation/ValidationRule";

/* tslint:disable:max-line-length */
const container = new Container();

// Validation
container.bind<interfaces.Newable<IValidationRule<ValidableScript>>>(TYPES.IValidationRule).toConstructor(ValidationRule);
container.bind<IScriptValidator>(TYPES.IScriptValidator).to(ScriptValidator);

// Generator
container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(DocumentationExtractor);

// Parser
container.bind<IJSDocParser>(TYPES.IJSDocParser).to(JSDocParser);
container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).to(DocProjectGenerator);

// Config
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);
container.bind<IOutputConfig>(TYPES.IOutputConfig).to(OutputConfig);
container.bind<IProjectConfig>(TYPES.IProjectConfig).to(ProjectConfig);
container.bind<interfaces.Newable<IProjectConfig>>(TYPES.NewableOfIProjectConfig).toConstructor(ProjectConfig);
container.bind<IScriptValidationRules>(TYPES.IScriptValidationRules).to(ScriptValidationRules);

// Cli
container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).to(CliGenerateFacade);

export default container;
