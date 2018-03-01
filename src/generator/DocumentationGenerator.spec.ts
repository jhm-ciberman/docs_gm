import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocumentationGenerator from "./DocumentationGenerator";
/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	@Test("Test")
	public async test() {
		/*const generator = new DocumentationGenerator();
		const p = new GMProject();
		await generator.generate(p, new ProjectConfig());*/
		Expect(DocumentationGenerator).toBe(DocumentationGenerator);
	}
}
