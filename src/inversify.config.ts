import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";

import CliGenerateFacade from "../src/cli/CliGenerateFacade";
import ICliGenerateFacade from "../src/cli/interfaces/ICliGenerateFacade";

import ConfigManager from "../src/config/ConfigManager";
import IConfigManager from "../src/config/interfaces/IConfigManager";

import DocProjectGenerator from "../src/generator/DocProjectGenerator";
import DocumentationExtractor from "../src/generator/DocumentationExtractor";
import IDocProjectGenerator from "../src/generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "../src/generator/interfaces/IDocumentationExtractor";

import IJSDocParser from "../src/parser/interfaces/IJSDocParser";
import JSDocParser from "../src/parser/JSDocParser";

import { getInstalledPath } from "get-installed-path";
import open = require("open");

import DocumentationGenerator from "../src/generator/DocumentationGenerator";
import IDocumentationGenerator from "../src/generator/interfaces/IDocumentationGenerator";
import { IGetInstalledPath, IOpen } from "../src/npmmodules";
import ConsoleReporter from "../src/reporter/ConsoleReporter";
import IReporter from "../src/reporter/interfaces/IReporter";
import DesignRenderer from "../src/template/DesignRenderer";
import IDesignRenderer from "../src/template/interfaces/IDesignRenderer";
import IModuleFinder from "../src/template/interfaces/IModuleFinder";
import IPageFeeder from "../src/template/interfaces/IPageFeeder";
import IRenderablePageGenerator from "../src/template/interfaces/IRenderablePageGenerator";
import ITemplateLoader from "../src/template/interfaces/ITemplateLoader";
import ModuleFinder from "../src/template/ModuleFinder";
import PageFeeder from "../src/template/PageFeeder";
import RenderablePageGenerator from "../src/template/RenderablePageGenerator";
import TemplateLoader from "../src/template/TemplateLoader";
import IRuleValidator from "../src/validation/interfaces/IRuleValidator";
import IScriptValidator from "../src/validation/interfaces/IScriptValidator";
import RuleValidator from "../src/validation/RuleValidator";
import ScriptValidator from "../src/validation/ScriptValidator";
import IScriptLoader from "./generator/interfaces/IScriptLoader";
import ScriptLoader from "./generator/ScriptLoader";
import GMProjectLoader from "./gm_project/GMProjectLoader";
import IGMProjectLoader from "./gm_project/interfaces/IGMProjectLoader";
import DesignLoader from "./template/DesignLoader";
import IDesignLoader from "./template/interfaces/IDesignLoader";
import ITemplateFactory from "./template/interfaces/ITemplateFactory";
import TemplateFactory from "./template/TemplateFactory";
import IRulesProvider from "./validation/interfaces/IRulesProvider";
import RulesProvider from "./validation/RulesProvider";

/* tslint:disable:max-line-length */
const container = new Container();

// Cli
container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).to(CliGenerateFacade);

// Config
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);

// Generator
container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(DocumentationExtractor);
container.bind<IDocumentationGenerator>(TYPES.IDocumentationGenerator).to(DocumentationGenerator);
container.bind<IScriptLoader>(TYPES.IScriptLoader).to(ScriptLoader);

// GM Project
container.bind<IGMProjectLoader>(TYPES.IGMProjectLoader).to(GMProjectLoader);

// Parser
container.bind<IJSDocParser>(TYPES.IJSDocParser).to(JSDocParser);
container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).to(DocProjectGenerator);

// Reporter
container.bind<IReporter>(TYPES.IReporter).to(ConsoleReporter);

// Template
container.bind<IModuleFinder>(TYPES.IModuleFinder).to(ModuleFinder);
container.bind<IRenderablePageGenerator>(TYPES.IRenderablePageGenerator).to(RenderablePageGenerator);
container.bind<IPageFeeder>(TYPES.IPageFeeder).to(PageFeeder);
container.bind<IDesignRenderer>(TYPES.IDesignRenderer).to(DesignRenderer);
container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(TemplateLoader);
container.bind<IDesignLoader>(TYPES.IDesignLoader).to(DesignLoader);
container.bind<ITemplateFactory>(TYPES.ITemplateFactory).to(TemplateFactory);

// Validation
container.bind<IScriptValidator>(TYPES.IScriptValidator).to(ScriptValidator);
container.bind<IRuleValidator>(TYPES.IRuleValidator).to(RuleValidator);
container.bind<IRulesProvider>(TYPES.IRulesProvider).to(RulesProvider);

// npm modules
container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(getInstalledPath);
container.bind<IOpen>(TYPES.IOpen).toFunction(open);

export default container;
