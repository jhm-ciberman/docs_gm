import {
	AsyncTest,
	Expect,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import { TYPES } from "../../../src/types";

import ProjectConfig from "../../../src/config/entities/ProjectConfig";
import IProjectConfig from "../../../src/config/interfaces/IProjectConfig";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProjectGenerator from "../../../src/generator/DocProjectGenerator";
import IDocFolderGenerator from "../../../src/generator/interfaces/IDocFolderGenerator";
import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMProject from "../../../src/gm_project/interfaces/IGMProject";
import MockGMFolder from "../__mock__/MockGMFolder.mock";
import MockGMProject from "../__mock__/MockGMProject.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockDocFolderGenerator implements IDocFolderGenerator {
	public async generate(_res: IGMFolder, _config: IProjectConfig, _gmProject: IGMProject): Promise<DocFolder> {
		return new DocFolder("my_super_script_folder");
	}
}
@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	@AsyncTest()
	public async generate_normal() {
		const p = new MockGMProject("my project", [
			new MockGMFolder("scripts", []),
		]);

		const container = new Container();
		container.bind<IDocFolderGenerator>(TYPES.IDocFolderGenerator).to(MockDocFolderGenerator);
		const generator = container.resolve(DocProjectGenerator);

		const doc = await generator.generate(p, new ProjectConfig());
		Expect(doc.name).toBe("my project");
		Expect(doc.scripts.name).toBe("my_super_script_folder");
	}

	@AsyncTest()
	public async generate_throw_no_root() {
		const p = new MockGMProject("my project", []);

		const container = new Container();
		container.bind<IDocFolderGenerator>(TYPES.IDocFolderGenerator).to(MockDocFolderGenerator);
		const generator = container.resolve(DocProjectGenerator);

		return generator.generate(p, new ProjectConfig()).then(() => {
			throw new Error("generate() did not throw on project with no root scripts folder");
		}).catch((e: Error) => {
			Expect(e).toBeDefined();
			Expect(e.message).toContain("No scripts folder found");
		});
	}

}
