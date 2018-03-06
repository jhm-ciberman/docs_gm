import {
	// Expect,
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";

import ProjectConfig from "../../src/config/entities/ProjectConfig";
import DocumentationGenerator from "../../src/generator/DocumentationGenerator";
import IDocProjectGenerator from "../../src/generator/interfaces/IDocProjectGenerator";

import IInputConfig from "../../src/config/interfaces/IOutputConfig";
import IProjectConfig from "../../src/config/interfaces/IProjectConfig";
import DocProject from "../../src/doc_models/DocProject";
import IGMProject from "../../src/gm_project/interfaces/IGMProject";
import Design from "../../src/template/entities/Design";
import IDesignLoader from "../../src/template/interfaces/IDesignLoader";
import IDesignRenderer from "../../src/template/interfaces/IDesignRenderer";
import { ITemplate } from "../../src/template/interfaces/ITemplate";
import { TYPES } from "../../src/types";
import MockGMProject from "../__mock__/MockGMProject.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockDocProjectGenerator implements IDocProjectGenerator {
	public async generate(_gmProject: IGMProject, _config: IProjectConfig): Promise<DocProject> {
		return new DocProject("project");
	}
}
@injectable()
class MockDesignRenderer implements IDesignRenderer {
	public async render(_design: Design, _docProject: DocProject, outputFolder: string): Promise<string> {
		return outputFolder + "YEAH!";
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
}
@injectable()
class MockDesignLoader implements IDesignLoader {
	public async load(_output: IInputConfig): Promise<Design> {
		return new Design(new MockTemplate(), {displayName: "my design", pages: []});
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
		container.bind<IDesignRenderer>(TYPES.IDesignRenderer).to(MockDesignRenderer);
		container.bind<IDesignLoader>(TYPES.IDesignLoader).to(MockDesignLoader);
		const dg = container.resolve(DocumentationGenerator);

		const output = await dg.generate(gmProject, config);

		Expect(output).toBe(config.output.outputFolder + "YEAH!");
	}
}
