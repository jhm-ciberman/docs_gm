import {
	AsyncTest,
	Expect,
	SpyOn,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import { TYPES } from "../../types";

import { TempDir } from "../_testing_helpers/TempDir.help";

import DocFolder from "../../src/doc_models/DocFolder";
import DocScript from "../../src/doc_models/DocScript";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

import ProjectConfig from "../../src/config/entities/ProjectConfig";
import IProjectConfig from "../../src/config/interfaces/IProjectConfig";
import DocProjectGenerator from "../../src/generator/DocProjectGenerator";
import IScriptLoader from "../../src/generator/interfaces/IScriptLoader";
import IGMProject from "../../src/gm_project/interfaces/IGMProject";
import MockGMFolder from "../__mock__/MockGMFolder.mock";
import MockGMProject from "../__mock__/MockGMProject.mock";
import MockGMScript from "../__mock__/MockGMScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */
class MockScriptLoader implements IScriptLoader {
	public async load(gmScript: IGMScript, _config: IProjectConfig, _gmProject: IGMProject): Promise<DocScript[]> {
		return [new DocScript(gmScript.name)];
	}
}

@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	public projectDir: TempDir;

	@AsyncTest("generate should call load() on each resource")
	public async generate_normal() {
		const [a, b, c] = [new MockGMScript("a"), new MockGMScript("b"), new MockGMScript("c")];

		const subFolder = new MockGMFolder("subfolder", [a, b, c]);
		const scriptsFolder = new MockGMFolder("scripts", [subFolder]);
		const p = new MockGMProject("my-project", [scriptsFolder]);

		const scriptLoader = new MockScriptLoader();
		const loadSpy = SpyOn(scriptLoader, "load");

		const container = new Container();
		container.bind<IScriptLoader>(TYPES.IScriptLoader).toConstantValue(scriptLoader);
		const generator = container.resolve(DocProjectGenerator);

		const doc = await generator.generate(p, new ProjectConfig());
		Expect(doc.name).toBe("my-project");

		Expect(doc.scripts.children.length).toBe(1);
		Expect(doc.scripts.children[0].name).toBe("subfolder");
		const children = (doc.scripts.children[0] as DocFolder).children;
		Expect(children.length).toBe(3);
		Expect(children[0].name).toBe("a");
		Expect(children[1].name).toBe("b");
		Expect(children[2].name).toBe("c");

		Expect(loadSpy).toHaveBeenCalled();
	}
}
