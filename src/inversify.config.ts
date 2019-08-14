import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "../src/cli/CliGenerateFacade";
import ICliGenerateFacade from "./cli/ICliGenerateFacade";

import ConfigManager from "../src/config/ConfigManager";
import IConfigManager from "./config/IConfigManager";

import DocumentationExtractor from "../src/generator/DocumentationExtractor";
import IDocumentationExtractor from "./generator/IDocumentationExtractor";

import JSDocParser from "../src/parser/JSDocParser";
import IJSDocParser from "./parser/IJSDocParser";

import { getInstalledPath } from "get-installed-path";
import open = require("open");

import pkgDir = require("pkg-dir");
import DocumentationGenerator from "../src/generator/DocumentationGenerator";
import { IGetInstalledPath, IOpen, IPkgDir } from "../src/npmmodules";
import ConsoleReporter from "../src/reporter/ConsoleReporter";
import TemplateLoader from "../src/template/TemplateLoader";
import IRuleValidator from "../src/validation/interfaces/IRuleValidator";
import IScriptValidator from "../src/validation/interfaces/IScriptValidator";
import RuleValidator from "../src/validation/RuleValidator";
import ScriptValidator from "../src/validation/ScriptValidator";
import ConfigOverrider from "./config/ConfigOverrider";
import IConfigOverrider from "./config/IConfigOverrider";
import DocFolderGenerator from "./generator/DocFolderGenerator";
import IDocFolderGenerator from "./generator/IDocFolderGenerator";
import IDocumentationGenerator from "./generator/IDocumentationGenerator";
import IProjectRootFinder from "./generator/IProjectRootFinder";
import IScriptLoader from "./generator/IScriptLoader";
import ProjectRootFinder from "./generator/ProjectRootFinder";
import ScriptLoader from "./generator/ScriptLoader";
import GMProjectLoader from "./gm_project/GMProjectLoader";
import IGMProjectLoader from "./gm_project/IGMProjectLoader";
import IRenderer from "./renderer/IRenderer";
import Renderer from "./renderer/Renderer";
import IReporter from "./reporter/IReporter";
import SchemaValidator from "./SchemaValidator";
import IModuleFinder from "./template/IModuleFinder";
import ITemplateLoader from "./template/ITemplateLoader";
import ModuleFinder from "./template/ModuleFinder";
import IRulesProvider from "./validation/interfaces/IRulesProvider";
import RulesProvider from "./validation/RulesProvider";

/* tslint:disable:max-line-length */
const container = new Container();

// Other
container.bind(TYPES.ISchemaValidator).to(SchemaValidator);

// Cli
container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).to(CliGenerateFacade);

// Config
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);
container.bind<IConfigOverrider>(TYPES.IConfigOverrider).to(ConfigOverrider);

// Generator
container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(DocumentationExtractor);
container.bind<IDocumentationGenerator>(TYPES.IDocumentationGenerator).to(DocumentationGenerator);
container.bind<IScriptLoader>(TYPES.IScriptLoader).to(ScriptLoader);
container.bind<IDocFolderGenerator>(TYPES.IDocFolderGenerator).to(DocFolderGenerator);
container.bind<IProjectRootFinder>(TYPES.IProjectRootFinder).to(ProjectRootFinder);

// GM Project
container.bind<IGMProjectLoader>(TYPES.IGMProjectLoader).to(GMProjectLoader);

// Parser
container.bind<IJSDocParser>(TYPES.IJSDocParser).to(JSDocParser);

// Renderer
container.bind<IRenderer>(TYPES.INunjucksRenderer).to(Renderer);

// Reporter
container.bind<IReporter>(TYPES.IReporter).to(ConsoleReporter);

// Template
container.bind<IModuleFinder>(TYPES.IModuleFinder).to(ModuleFinder);
container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(TemplateLoader);

// Validation
container.bind<IScriptValidator>(TYPES.IScriptValidator).to(ScriptValidator);
container.bind<IRuleValidator>(TYPES.IRuleValidator).to(RuleValidator);
container.bind<IRulesProvider>(TYPES.IRulesProvider).to(RulesProvider);

// npm modules
container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(getInstalledPath);
container.bind<IOpen>(TYPES.IOpen).toFunction(open);
container.bind<IPkgDir>(TYPES.IPkgDir).toFunction(pkgDir);

export default container;
