import { Container } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "./src/cli/CliGenerateFacade";
import ICliGenerateFacade from "./src/cli/interfaces/ICliGenerateFacade";

import ConfigManager from "./src/config/ConfigManager";
import IConfigManager from "./src/config/interfaces/IConfigManager";

import DocProjectGenerator from "./src/generator/DocProjectGenerator";
import DocumentationExtractor from "./src/generator/DocumentationExtractor";
import IDocProjectGenerator from "./src/generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "./src/generator/interfaces/IDocumentationExtractor";

import IJSDocParser from "./src/parser/interfaces/IJSDocParser";
import JSDocParser from "./src/parser/JSDocParser";

import DocumentationGenerator from "./src/generator/DocumentationGenerator";
import IDocumentationGenerator from "./src/generator/interfaces/IDocumentationGenerator";
import ConsoleReporter from "./src/reporter/ConsoleReporter";
import IReporter from "./src/reporter/interfaces/IReporter";
import IRuleValidator from "./src/validation/interfaces/IRuleValidator";
import IScriptValidator from "./src/validation/interfaces/IScriptValidator";
import RuleValidator from "./src/validation/RuleValidator";
import ScriptValidator from "./src/validation/ScriptValidator";

/* tslint:disable:max-line-length */
const container = new Container();

// Validation
container.bind<IScriptValidator>(TYPES.IScriptValidator).to(ScriptValidator);
container.bind<IRuleValidator>(TYPES.IRuleValidator).to(RuleValidator);

// Generator
container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(DocumentationExtractor);
container.bind<IDocumentationGenerator>(TYPES.IDocumentationGenerator).to(DocumentationGenerator);

// Parser
container.bind<IJSDocParser>(TYPES.IJSDocParser).to(JSDocParser);
container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).to(DocProjectGenerator);

// Config
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);

// Cli
container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).to(CliGenerateFacade);

// Reporter
container.bind<IReporter>(TYPES.IReporter).to(ConsoleReporter);

export default container;
