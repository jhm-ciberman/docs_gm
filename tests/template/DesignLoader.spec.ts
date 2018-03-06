import {
	AsyncTest,
	Expect,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import OutputConfig from "../../src/config/entities/OutputConfig";
import DesignLoader from "../../src/template/DesignLoader";
import Design from "../../src/template/entities/Design";
import IModuleFinder from "../../src/template/interfaces/IModuleFinder";
import { ITemplate } from "../../src/template/interfaces/ITemplate";
import ITemplateLoader from "../../src/template/interfaces/ITemplateLoader";
import { TYPES } from "../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockModuleFinder implements IModuleFinder {
	public async find(moduleName: string): Promise<string> {
		if (moduleName === "docs_gm-myTemplateName") {
			return "foo";
		}
		throw new Error("Invalid argument");
	}
}
class MockTemplate implements ITemplate {
	public folder: string;
	public author: string | undefined;
	public defaultDesign: Design = new Design(this, { displayName: "NOT THIS DESIGN", pages: [] });
	public description: string | undefined;
	public web: string | undefined;
	public getDesign(design: string): Design | undefined {
		return (design === "has_this_design")
			? new Design(this, {displayName: "my super design", pages: []})
			: undefined;
	}
	public hasDesign(design: string): boolean {
		return (design === "has_this_design");
	}
	public designs(): IterableIterator<Design> {
		throw new Error("Method not implemented.");
	}
}
@injectable()
class MockTemplateLoader implements ITemplateLoader {
	public async loadFrom(folder: string): Promise<ITemplate> {
		if (folder === "foo") {
			const template = new MockTemplate();
			template.author = "Darth Vader";
			return template;
		}
		throw new Error("Method not implemented.");
	}
}
@TestFixture("DesignLoader")
export class DesignLoaderFixture {

	@AsyncTest("pageFeeder_allTheScriptsInOnePage")
	public async pageFeeder_allTheScriptsInOnePage() {
		const container = new Container();
		container.bind<IModuleFinder>(TYPES.IModuleFinder).to(MockModuleFinder);
		container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(MockTemplateLoader);

		const dl = container.resolve(DesignLoader);
		const outputConfig = new OutputConfig();
		outputConfig.template = "myTemplateName";
		outputConfig.design = "has_this_design";
		const design = await dl.load(outputConfig);
		Expect(design.displayName).toBe("my super design");
		Expect(design.template.author).toBe("Darth Vader");
	}
}
