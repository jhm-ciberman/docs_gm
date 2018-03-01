import {
	AsyncTest,
	Expect,
	IgnoreTests,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	TestFixture,
} from "alsatian";
import { TempDir } from "../_testing_helpers/TempDir.help";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import ProjectConfig from "../config/models/ProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";
import container from "../inversify.config";
import { TYPES } from "../types";
import GMFolderMock from "./__mock__/GMFolderMock.mock";
import GMProjectMock from "./__mock__/GMProjectMock.mock";
import GMScriptMock from "./__mock__/GMScriptMock.mock";
import IDocProjectGenerator from "./IDocProjectGenerator";

/* tslint:disable:max-classes-per-file completed-docs */

// TODO: Decouple all
@IgnoreTests("The test cannot be done without decoupling first")
@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	public projectDir: TempDir;

	@SetupFixture
	public setup() {
		this.projectDir = TempDir.create("my-project", {
			"a.gml": "a",
			"b.gml": "b",
		});
		container.snapshot();
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
		container.restore();
	}

	@AsyncTest("generate")
	public async generate_normal() {
		const a = new GMScriptMock("a", "a.gml");
		const b = new GMScriptMock("b", "b.gml");
		const scriptsFolder = new GMFolderMock("scripts", [a, b]);
		const p = new GMProjectMock("my-project", [scriptsFolder]);
		p.path = this.projectDir.dir;

		container.rebind<IGMProject>(TYPES.IGMProject).toConstantValue(p);
		const generator = container.get<IDocProjectGenerator>(TYPES.IDocProjectGenerator);
		const doc = await generator.generate();
		Expect(doc.name).toBe("my-project");
		Expect(doc.scripts.children.length).toBe(2);
	}

	@AsyncTest("generate should use globs to match the fullpath")
	public async generate_not_match() {
		const a = new GMScriptMock("a", "not/match/this/a.gml");
		const b = new GMScriptMock("b", "match/b.gml");
		const subFolder = new GMFolderMock("subfolder", [a, b]);
		const scriptsFolder = new GMFolderMock("scripts", [subFolder]);

		const spyA = SpyOn(a, "match");
		const spyB = SpyOn(b, "match");
		const spySubFolder = SpyOn(subFolder, "match");
		const spyFolder = SpyOn(scriptsFolder, "match");

		const p = new GMProjectMock("my-project", [scriptsFolder]);
		p.path = this.projectDir.dir;

		const config = new ProjectConfig();
		config.output.pattern = "**/match/**";

		container.rebind<IProjectConfig>(TYPES.IProjectConfig).toConstantValue(config);
		const generator = container.get<IDocProjectGenerator>(TYPES.IDocProjectGenerator);
		const doc = await generator.generate();
		Expect(doc.scripts.children.length).toBe(1);
		Expect(doc.scripts.children[0].name).toBe("b");
		Expect(spyA).toHaveBeenCalledWith("**/match/**");
		Expect(spyB).toHaveBeenCalledWith("**/match/**");
		Expect(spySubFolder).toHaveBeenCalledWith("**/match/**");
		Expect(spyFolder).toHaveBeenCalledWith("**/match/**");
	}
}
