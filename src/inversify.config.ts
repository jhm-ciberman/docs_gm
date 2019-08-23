import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "./cli/CliGenerateFacade";
import ICliGenerateFacade from "./cli/ICliGenerateFacade";

import ConfigManager from "./config/ConfigManager";
import IConfigManager from "./config/IConfigManager";

import DocumentationExtractor from "./generator/DocumentationExtractor";
import IDocumentationExtractor from "./generator/IDocumentationExtractor";

import IJSDocParser from "./parser/IJSDocParser";
import JSDocParser from "./parser/JSDocParser";

import { getInstalledPath } from "get-installed-path";
import open = require("open");

import pkgDir = require("pkg-dir");
import ConfigOverrider from "./config/ConfigOverrider";
import IConfigOverrider from "./config/IConfigOverrider";
import DocFolderGenerator from "./generator/DocFolderGenerator";
import DocumentationGenerator from "./generator/DocumentationGenerator";
import IDocFolderGenerator from "./generator/IDocFolderGenerator";
import IDocumentationGenerator from "./generator/IDocumentationGenerator";
import IProjectRootFinder from "./generator/IProjectRootFinder";
import IScriptLoader from "./generator/IScriptLoader";
import ProjectRootFinder from "./generator/ProjectRootFinder";
import ScriptLoader from "./generator/ScriptLoader";
import GMProjectLoader from "./gm_project/GMProjectLoader";
import IGMProjectLoader from "./gm_project/IGMProjectLoader";
import { IGetInstalledPath, IOpen, IPkgDir } from "./npmmodules";
import IScriptCommentParser from "./parser/IScriptCommentParser";
import ScriptCommentParser from "./parser/ScriptCommentParser";
import IRenderer from "./renderer/IRenderer";
import Renderer from "./renderer/Renderer";
import ConsoleReporter from "./reporter/ConsoleReporter";
import IReporter from "./reporter/IReporter";
import SchemaValidator from "./SchemaValidator";
import IModuleFinder from "./template/IModuleFinder";
import ITemplateLoader from "./template/ITemplateLoader";
import ModuleFinder from "./template/ModuleFinder";
import TemplateLoader from "./template/TemplateLoader";
import IRulesProvider from "./validation/interfaces/IRulesProvider";
import IRuleValidator from "./validation/interfaces/IRuleValidator";
import IScriptValidator from "./validation/interfaces/IScriptValidator";
import RulesProvider from "./validation/RulesProvider";
import RuleValidator from "./validation/RuleValidator";
import ScriptValidator from "./validation/ScriptValidator";

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
container.bind<IScriptCommentParser>(TYPES.IScriptCommentParser).to(ScriptCommentParser);

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
