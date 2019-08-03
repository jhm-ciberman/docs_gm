import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";

import ProjectConfig from "../../../src/config/ProjectConfig";
import DocumentationGenerator from "../../../src/generator/DocumentationGenerator";

import IInputConfig from "../../../src/config/IOutputConfig";
import IProjectConfig from "../../../src/config/IProjectConfig";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import IDocFolderGenerator from "../../../src/generator/IDocFolderGenerator";
import IProjectRootFinder from "../../../src/generator/IProjectRootFinder";
import IGMFolder from "../../../src/gm_project/IGMFolder";
import IGMProject from "../../../src/gm_project/IGMProject";
import IDesignFilesCopier from "../../../src/renderer/IDesignFilesCopier";
import INunjucksRenderer from "../../../src/renderer/INunjucksRenderer";
import Design from "../../../src/template/Design";
import { ITemplate } from "../../../src/template/ITemplate";
import ITemplateLoader from "../../../src/template/ITemplateLoader";
import { TYPES } from "../../../src/types";
import MockGMProject from "../__mock__/MockGMProject.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockProjectRootFinder implements IProjectRootFinder {
	public find(folder: IGMFolder, _path: string): IGMFolder {
		return folder;
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
@injectable()
class MockDocFolderGenerator implements IDocFolderGenerator {
	public async generate(_res: IGMFolder, _config: IProjectConfig, _gmProject: IGMProject): Promise<DocFolder> {
		return new DocFolder("folder");
	}
}
@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	@Test()
	public async DocumentationGenerator() {
		const gmProject = new MockGMProject("my project", []);
		const config = new ProjectConfig();
		config.output.outputFolder = "output_folder";

		const container = new Container();
		container.bind<IProjectRootFinder>(TYPES.IProjectRootFinder).to(MockProjectRootFinder);
		container.bind<INunjucksRenderer>(TYPES.INunjucksRenderer).to(MockRenderer);
		container.bind<IDesignFilesCopier>(TYPES.IDesignFilesCopier).to(MockDesignFilesCopier);
		container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(MockTemplateLoader);
		container.bind<IDocFolderGenerator>(TYPES.IDocFolderGenerator).to(MockDocFolderGenerator);
		const dg = container.resolve(DocumentationGenerator);

		const output = await dg.generate(gmProject, config);

		Expect(output).toBe(config.output.outputFolder);
	}
}
