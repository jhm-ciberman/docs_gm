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

import IRule from "./src/validation/interfaces/IRule";
import IScriptValidator from "./src/validation/interfaces/IScriptValidator";
import IValidableScript from "./src/validation/interfaces/IValidableScript";
import RuleMismatchingArguments from "./src/validation/rules/RuleMismatchingArguments";
import RuleMismatchingFunctionName from "./src/validation/rules/RuleMismatchingFunctionName";
import RuleNoDescription from "./src/validation/rules/RuleNoDescription";
import RulePrivate from "./src/validation/rules/RulePrivate";
import RuleUndocumented from "./src/validation/rules/RuleUndocumented";
import RuleUndocumentedArguments from "./src/validation/rules/RuleUndocumentedArguments";
import ScriptValidator from "./src/validation/ScriptValidator";

/* tslint:disable:max-line-length */
const container = new Container();

// Validation
container.bind<IScriptValidator>(TYPES.IScriptValidator).to(ScriptValidator);
// Generator
container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(DocumentationExtractor);
// Parser
container.bind<IJSDocParser>(TYPES.IJSDocParser).to(JSDocParser);
container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).to(DocProjectGenerator);
// Config
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);
// Cli
container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).to(CliGenerateFacade);

// Rules
container.bind<IRule<IValidableScript>>(TYPES.RuleMismatchingArguments).to(RuleMismatchingArguments);
container.bind<IRule<IValidableScript>>(TYPES.RuleMismatchingFunctionName).to(RuleMismatchingFunctionName);
container.bind<IRule<IValidableScript>>(TYPES.RuleNoDescription).to(RuleNoDescription);
container.bind<IRule<IValidableScript>>(TYPES.RulePrivate).to(RulePrivate);
container.bind<IRule<IValidableScript>>(TYPES.RuleUndocumented).to(RuleUndocumented);
container.bind<IRule<IValidableScript>>(TYPES.RuleUndocumentedArguments).to(RuleUndocumentedArguments);

export default container;
