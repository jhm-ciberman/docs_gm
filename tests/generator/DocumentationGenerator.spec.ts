import {
	// Expect,
	Test,
	TestFixture,
} from "alsatian";
/*
import { Container } from "inversify";
import { TYPES } from "../../types";

import ProjectConfig from "../../src/config/entities/ProjectConfig";
import DocumentationGenerator from "../../src/generator/DocumentationGenerator";
import IDocProjectGenerator from "../../src/generator/interfaces/IDocProjectGenerator";

import MockGMProject from "../__mock__/MockGMProject.mock";
*/
/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	@Test("Test")
	public async test() {
		/*const gmProject = new MockGMProject("my project", []);
		const config = new ProjectConfig();

		const container = new Container();
		const documentationGenerator = container.resolve(DocumentationGenerator);

		container.bind<IDocProjectGenerator>(TYPES.IDocProjectGenerator).toConstantValue(mockDocProjectGenerator);

		const output = await documentationGenerator.generate(gmProject, config);

		Expect(output).toBe(config.output.outputFolder);*/
	}
}
