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

import IProjectConfig from "../../src/config/interfaces/IProjectConfig";
import IDocProjectGenerator from "../../src/generator/interfaces/IDocProjectGenerator";
import IDocumentationExtractor from "../../src/generator/interfaces/IDocumentationExtractor";
import IGMProject from "../../src/gm_project/interfaces/IGMProject";

import DocFolder from "../../src/doc_models/DocFolder";
import DocScript from "../../src/doc_models/DocScript";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";
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

		const spyMatchA = SpyOn(a, "match");
		const spyMatchB = SpyOn(b, "match");
		const spyMatchC = SpyOn(c, "match");

		spyMatchA.andReturn(true);
		spyMatchB.andReturn(true);
		spyMatchC.andReturn(false); // match() returns false!

		const spyLoadFromStringA = SpyOn(a, "loadFromString");
		const spyLoadFromStringB = SpyOn(b, "loadFromString");
		const spyLoadFromStringC = SpyOn(c, "loadFromString");

		spyLoadFromStringA.andStub();
		spyLoadFromStringB.andStub();
		spyLoadFromStringC.andStub();

		const PATTERN = "**/match/**";
		const config = container.get<IProjectConfig>(TYPES.IProjectConfig);
		config.output.pattern = PATTERN;

		const docExtractor = new MockDocumentationExtractor();
		const fakeExtractDocScripts = (gmScript: IGMScript) => {
			return [new DocScript(gmScript.name)];
		};
		SpyOn(docExtractor, "extractDocScripts").andCall(fakeExtractDocScripts as () => any);

		container.rebind<IProjectConfig>(TYPES.IProjectConfig).toConstantValue(config);
		container.rebind<IGMProject>(TYPES.IGMProject).toConstantValue(p);
		container.rebind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).toConstantValue(docExtractor);

		const generator = container.get<IDocProjectGenerator>(TYPES.IDocProjectGenerator);

		const doc = await generator.generate();
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
}

// const aaa = function *() {
// 	const gml = [
// 		"/**",
// 		" * My documentation ",
// 		" */",
// 	];
// 	yield ["my-script", gml.join("\n")];
// };

// const loadFromString = (str: string) => {
// 	if (str !== "a" && str !== "b") {
// 		throw new Error("Invalid arguments to mock loadFromString");
// 	}
// };