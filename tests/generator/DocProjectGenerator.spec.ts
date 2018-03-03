import {
	AsyncTest,
	Expect,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import container from "../../inversify.config";
import { TYPES } from "../../types";

import { TempDir } from "../_testing_helpers/TempDir.help";

import DocFolder from "../../src/doc_models/DocFolder";
import DocScript from "../../src/doc_models/DocScript";
import IDocProjectGenerator from "../../src/generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "../../src/generator/interfaces/IDocumentationExtractor";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

import ProjectConfig from "../../src/config/entities/ProjectConfig";
import MockDocumentationExtractor from "../__mock__/MockDocumentationExtractor.mock";
import MockGMFolder from "../__mock__/MockGMFolder.mock";
import MockGMProject from "../__mock__/MockGMProject.mock";
import MockGMScript from "../__mock__/MockGMScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	public projectDir: TempDir;

	@SetupFixture
	public setup() {
		this.projectDir = TempDir.create("my-project", {
			"a.gml": "a file content",
			"b.gml": "b file content",
			"c.gml": "c file content",
		});
		container.snapshot();
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
		container.restore();
	}

	@AsyncTest("generate should call match() on each resource and call GMScript.loadFromScript()")
	public async generate_normal() {
		const b = new MockGMScript("b", "b.gml", this.projectDir.join("a.gml"));
		const a = new MockGMScript("a", "a.gml", this.projectDir.join("b.gml"));
		const c = new MockGMScript("c", "c.gml", this.projectDir.join("c.gml"));
		const subFolder = new MockGMFolder("subfolder", [a, b, c]);
		const scriptsFolder = new MockGMFolder("scripts", [subFolder]);
		const p = new MockGMProject("my-project", [scriptsFolder], this.projectDir.dir);

		const spyMatchA = this._spyAndReturn(a, "match", true);
		const spyMatchB = this._spyAndReturn(b, "match", true);
		const spyMatchC = this._spyAndReturn(c, "match", false); // match() returns false!

		const spyLoadFromStringA = this._spyAndStub(a, "loadFromString");
		const spyLoadFromStringB = this._spyAndStub(b, "loadFromString");
		const spyLoadFromStringC = this._spyAndStub(c, "loadFromString");

		const PATTERN = "**/match/**";
		const config = new ProjectConfig();
		config.output.pattern = PATTERN;

		const docExtractor = new MockDocumentationExtractor();
		const fakeExtractDocScripts = (gmScript: IGMScript) => [new DocScript(gmScript.name)];
		SpyOn(docExtractor, "extractDocScripts").andCall(fakeExtractDocScripts as () => any);

		container.rebind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).toConstantValue(docExtractor);

		const generator = container.get<IDocProjectGenerator>(TYPES.IDocProjectGenerator);

		const doc = await generator.generate(p, config);
		Expect(doc.name).toBe("my-project");

		Expect(spyMatchA).toHaveBeenCalledWith(PATTERN);
		Expect(spyMatchB).toHaveBeenCalledWith(PATTERN);
		Expect(spyMatchC).toHaveBeenCalledWith(PATTERN);

		Expect(spyLoadFromStringA).toHaveBeenCalled();
		Expect(spyLoadFromStringB).toHaveBeenCalled();
		Expect(spyLoadFromStringC).not.toHaveBeenCalled();

		Expect(doc.scripts.children.length).toBe(1);
		Expect(doc.scripts.children[0].name).toBe("subfolder");
		Expect((doc.scripts.children[0] as DocFolder).children.length).toBe(2);
		Expect((doc.scripts.children[0] as DocFolder).children[0].name).toBe("a");
		Expect((doc.scripts.children[0] as DocFolder).children[1].name).toBe("b");
	}

	private _spyAndReturn(target: any, method: string, value: any) {
		const spy = SpyOn(target, method);
		spy.andReturn(value);
		return spy;
	}

	private _spyAndStub(target: any, method: string) {
		const spy = SpyOn(target, method);
		spy.andStub();
		return spy;
	}
}
