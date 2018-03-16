import {
	// Expect,
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";

import ProjectConfig from "../../../src/config/entities/ProjectConfig";
import DocumentationGenerator from "../../../src/generator/DocumentationGenerator";
import IDocProjectGenerator from "../../../src/generator/interfaces/IDocProjectGenerator";

import IInputConfig from "../../../src/config/interfaces/IOutputConfig";
import IProjectConfig from "../../../src/config/interfaces/IProjectConfig";
import DocProject from "../../../src/doc_models/DocProject";
import IGMProject from "../../../src/gm_project/interfaces/IGMProject";
import IDesignFilesCopier from "../../../src/renderer/interfaces/IDesignFilesCopier";
import INunjucksRenderer from "../../../src/renderer/interfaces/INunjucksRenderer";
import Design from "../../../src/template/Design";
import { ITemplate } from "../../../src/template/interfaces/ITemplate";
import ITemplateLoader from "../../../src/template/interfaces/ITemplateLoader";
import { TYPES } from "../../../src/types";
import MockGMProject from "../__mock__/MockGMProject.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockDocProjectGenerator implements IDocProjectGenerator {
	public async generate(_gmProject: IGMProject, _config: IProjectConfig): Promise<DocProject> {
		return new DocProject("project");
	}
}
@injectable()
class MockRenderer implements INunjucksRenderer {
	public async render(_design: Design, _docProject: DocProject, _outputFolder: string): Promise<void> {
		// void
	}
}
@injectable()
class MockDesignFilesCopier implements IDesignFilesCopier {
	public async copy(_outputFolder: string, _design: Design): Promise<void> {
		// void
	}
}
@injectable()
class MockTemplateLoader implements ITemplateLoader {
	public async loadFrom(_folder: string): Promise<ITemplate> {
		return new MockTemplate();
	}
	public async getFolder(_output: IInputConfig): Promise<string> {
		return "foo";
	}
}
class MockTemplate implements ITemplate {
	public folder: string;
	public author: string | undefined;
	public defaultDesign: Design;
	public description: string | undefined;
	public web: string | undefined;
	public getDesign(_design: string): Design | undefined {
		throw new Error("Method not implemented.");
	}
	public hasDesign(_design: string): boolean {
		throw new Error("Method not implemented.");
	}
	public designs(): IterableIterator<Design> {
		throw new Error("Method not implemented.");
	}
	public findDesign(_designName: string): Design {
		return new Design(this, {displayName: "foo", index: "foo.bar"});
	}
}
@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	@Test("Test")
	public async test() {
		const gmProject = new MockGMProject("my project", []);
		const config = new ProjectConfig();
		config.output.outputFolder = "output_folder";

		const container = new Container();
		container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).to(MockDocProjectGenerator);
		container.bind<INunjucksRenderer>(TYPES.INunjucksRenderer).to(MockRenderer);
		container.bind<IDesignFilesCopier>(TYPES.IDesignFilesCopier).to(MockDesignFilesCopier);
		container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(MockTemplateLoader);
		const dg = container.resolve(DocumentationGenerator);

		const output = await dg.generate(gmProject, config);

		Expect(output).toBe(config.output.outputFolder + "YEAH!");
	}
}
