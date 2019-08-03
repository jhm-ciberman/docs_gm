import {
	// Expect,
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import IScriptValidationRules from "../../../src/config/IScriptValidationRules";
import ProjectConfig from "../../../src/config/ProjectConfig";
import DocScript from "../../../src/doc_models/DocScript";
import IDocumentationExtractor from "../../../src/generator/IDocumentationExtractor";
import ScriptLoader from "../../../src/generator/ScriptLoader";
import GMSubscript from "../../../src/gm_project/GMSubscript";
import IGMFolder from "../../../src/gm_project/IGMFolder";
import IGMScript from "../../../src/gm_project/IGMScript";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockGMProject from "../__mock__/MockGMProject.mock";

/* tslint:disable:max-classes-per-file completed-docs */
class MockGMScript implements IGMScript {
	public filepath: string;
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public * subScripts(gmlText: string): IterableIterator<GMSubscript> {
		if (gmlText === "my gml") {
			yield new GMSubscript("foo", "text");
		}
	}
	public match(pattern: string): boolean {
		return (pattern === "foo");
	}
}
@injectable()
class MockDocumentationExtractor implements IDocumentationExtractor {
	public extractDocScripts(
		_subscriptsIterator: IterableIterator<GMSubscript>,
		_rules: IScriptValidationRules,
	): DocScript[] {
		return [new DocScript("hi")];
	}
}
@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	public folder: TempDir;

	@Setup
	public setup() {
		this.folder = TempDir.create("folder", {
			"script.gml": "my gml",
		});
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("Test normal")
	public async test_normal() {
		const output = await this._doTheTest("foo", "script.gml");
		Expect(output[0].name).toBe("hi");
	}

	@Test("Test not match")
	public async test_not_match() {
		const output = await this._doTheTest("NOT_MATCH", "script.gml");
		Expect(output.length).toBe(0);
	}

	@Test("test_should_throw_on_non_existent_file")
	public async test_should_throw_on_non_existent_file() {
		return this._doTheTest("foo", "NON_EXISTENT_FILE.gml").then(() => {
			throw new Error("Not throw on non existent file");
		}).catch((e: Error) => {
			Expect(e.message).toContain("Error loading file");
		});

	}

	private _doTheTest(pattern: string, filepath: string) {
		const gmScript = new MockGMScript();
		gmScript.filepath = filepath;

		const config = new ProjectConfig();
		config.pattern = pattern;

		const gmProject = new MockGMProject("my-project", []);
		gmProject.path = this.folder.dir;

		const container = new Container();
		container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(MockDocumentationExtractor);

		const sl = container.resolve(ScriptLoader);

		return sl.load(gmScript, config, gmProject);
	}
}
