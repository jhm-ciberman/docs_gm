import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";

import { IOutputConfig, IProjectConfig } from "../../../src/config/IProjectConfig";
import { ProjectConfig } from "../../../src/config/ProjectConfig";
// tslint:disable-next-line:ordered-imports
import DocFolder from "../../../src/doc_models/DocFolder";
import DocumentationGenerator from "../../../src/generator/DocumentationGenerator";
import IDocFolderGenerator from "../../../src/generator/IDocFolderGenerator";
import IProjectRootFinder from "../../../src/generator/IProjectRootFinder";
import IGMFolder from "../../../src/gm_project/IGMFolder";
import IGMProject from "../../../src/gm_project/IGMProject";
import IRenderer from "../../../src/renderer/IRenderer";
import RenderingQueue from "../../../src/renderer/RenderingQueue";
import ITemplateLoader from "../../../src/template/ITemplateLoader";
import Template from "../../../src/template/Template";
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
class MockRenderer implements IRenderer {
	public async render(_template: Template, _queue: RenderingQueue, _outputFolder: string): Promise<void> {
		return;
	}
}
@injectable()
class MockTemplateLoader implements ITemplateLoader {
	public async loadFrom(folder: string): Promise<Template> {
		return new Template(folder, {
			author: "Darth Vader",
			description: "My description",
			web: "http://myweb.com/",
			name: "My design name",
			copy: ["aaa"],
			pages: {
				index: "index-foo.njk",
			},
		});
	}
	public async getFolder(_output: IOutputConfig): Promise<string> {
		return "foo";
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
		container.bind<IRenderer>(TYPES.INunjucksRenderer).to(MockRenderer);
		container.bind<ITemplateLoader>(TYPES.ITemplateLoader).to(MockTemplateLoader);
		container.bind<IDocFolderGenerator>(TYPES.IDocFolderGenerator).to(MockDocFolderGenerator);
		const dg = container.resolve(DocumentationGenerator);

		const output = await dg.generate(gmProject, config);

		Expect(output).toBe(config.output.outputFolder);
	}
}
