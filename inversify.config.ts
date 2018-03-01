import { Container, interfaces } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "./src/cli/CliGenerateFacade";
import ICliGenerateFacade from "./src/cli/interfaces/ICliGenerateFacade";

import ConfigManager from "./src/config/ConfigManager";
import IConfigManager from "./src/config/interfaces/IConfigManager";
import IOutputConfig from "./src/config/interfaces/IOutputConfig";
import IProjectConfig from "./src/config/interfaces/IProjectConfig";
import IScriptValidationRules from "./src/config/interfaces/IScriptValidationRules";
import OutputConfig from "./src/config/OutputConfig";
import ProjectConfig from "./src/config/ProjectConfig";
import ScriptValidationRules from "./src/config/ScriptValidationRules";

import DocProjectGenerator from "./src/generator/DocProjectGenerator";
import DocumentationExtractor from "./src/generator/DocumentationExtractor";
import IDocProjectGenerator from "./src/generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "./src/generator/interfaces/IDocumentationExtractor";

import IJSDocParser from "./src/parser/interfaces/IJSDocParser";
import JSDocParser from "./src/parser/JSDocParser";

import GMProject from "./src/gm_project/GMProject";
import IGMProject from "./src/gm_project/interfaces/IGMProject";
import IScriptValidator from "./src/validation/interfaces/IScriptValidator";
import IValidationRule from "./src/validation/interfaces/IValidationRule";
import ScriptValidator from "./src/validation/ScriptValidator";
import ValidableScript from "./src/validation/ValidableScript";
import ValidationRule from "./src/validation/ValidationRule";

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

// GM Project
container.bind<IGMProject>(TYPES.IGMProject).to(GMProject);

export default container;
