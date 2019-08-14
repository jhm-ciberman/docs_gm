import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import { IProjectConfig } from "../../../src/config/IProjectConfig";
import { ProjectConfig } from "../../../src/config/ProjectConfig";
import DocProject from "../../../src/doc_models/DocProject";
import DocScript from "../../../src/doc_models/DocScript";
import DocFolderGenerator from "../../../src/generator/DocFolderGenerator";
import IScriptLoader from "../../../src/generator/IScriptLoader";
import GMResource from "../../../src/gm_project/GMResource";
import IGMProject from "../../../src/gm_project/IGMProject";
import IGMScript from "../../../src/gm_project/IGMScript";
import { TYPES } from "../../../src/types";
import MockGMFolder from "../__mock__/MockGMFolder.mock";
import MockGMProject from "../__mock__/MockGMProject.mock";
import MockGMScript from "../__mock__/MockGMScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockScriptLoader implements IScriptLoader {
	public async load(gmScript: IGMScript, _config: IProjectConfig, _gmProject: IGMProject): Promise<DocScript[]> {
		const s = new DocScript(gmScript.name);
		s.description = "foo description " + gmScript.name;
		return gmScript.name === "RETURN_EMPTY" ? [] : [s];
	}
}

@TestFixture("DocFolder")
export class DocFolderGeneratorFixture {

	@Test()
	public async DocFolderGenerator_generate() {
		const f = new MockGMFolder("my_folder", [
			new MockGMScript("my_script1"),
			new MockGMScript("my_script2"),
			new MockGMFolder("subfolder", [
				new MockGMScript("my_script2"),
			]),
		]);

		const docFolder = await this._get()
				.generate(f, new ProjectConfig(), new MockGMProject("My project", []), new DocProject("MyProject"));

		Expect(docFolder.description).toBe("");
		Expect(docFolder.children.length).toBe(3);
		Expect(docFolder.children[0].name).toBe("my_script1");
		Expect(docFolder.children[1].name).toBe("my_script2");
		Expect(docFolder.children[2].name).toBe("subfolder");
	}

	@TestCase(new MockGMScript("MODULE_my_folder"), "foo description MODULE_my_folder")
	@TestCase(new MockGMScript("RETURN_EMPTY"), "")
	@Test()
	public async DocFolderGenerator_moduleScript(moduleScript: IGMScript | null, expectedDescription: string) {
		const f = new MockGMFolder("my_folder", []);
		f.moduleScript = moduleScript;

		const docFolder = await this._get()
				.generate(f, new ProjectConfig(), new MockGMProject("My project", []), new DocProject("MyProject"));

		Expect(docFolder.description).toBe(expectedDescription);
	}

	@Test()
	public async DocFolderGenerator_shouldIgnoreEmptyFolders() {
		const f = new MockGMFolder("my_folder", [
			new MockGMScript("my_script1"),
			new MockGMScript("my_script2"),
			new MockGMFolder("subfolder", [
				new MockGMScript("RETURN_EMPTY"),
				new MockGMScript("RETURN_EMPTY"),
				new MockGMScript("RETURN_EMPTY"),
			]),
		]);

		const docFolder = await this._get()
				.generate(f, new ProjectConfig(), new MockGMProject("My project", []), new DocProject("MyProject"));

		Expect(docFolder.children.length).toBe(2);
		Expect(docFolder.children[0].name).toBe("my_script1");
		Expect(docFolder.children[1].name).toBe("my_script2");
	}

	@Test()
	public async DocFolderGenerator_throw_on_unrecognized() {
		const f = new MockGMFolder("my_folder", [
			new GMResource("my_script"),
		]);

		return await this._get()
		.generate(f, new ProjectConfig(), new MockGMProject("My project", []), new DocProject("MyProject"))
		.then(() => {
			throw new Error("generate() did not throw on project with no root scripts folder");
		}).catch((e: Error) => {
			Expect(e).toBeDefined();
			Expect(e.message).toContain("Unrecognized resource type for resource");
		});
	}

	private _get(): DocFolderGenerator {
		const container = new Container();
		container.bind<IScriptLoader>(TYPES.IScriptLoader).to(MockScriptLoader);
		return container.resolve(DocFolderGenerator);
	}
}
