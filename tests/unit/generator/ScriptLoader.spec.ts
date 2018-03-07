import {
	// Expect,
	Expect,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import ProjectConfig from "../../../src/config/entities/ProjectConfig";
import IScriptValidationRules from "../../../src/config/interfaces/IScriptValidationRules";
import DocScript from "../../../src/doc_models/DocScript";
import IDocumentationExtractor from "../../../src/generator/interfaces/IDocumentationExtractor";
import ScriptLoader from "../../../src/generator/ScriptLoader";
import GMSubscript from "../../../src/gm_project/GMSubscript";
import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMScript from "../../../src/gm_project/interfaces/IGMScript";
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
		throw new Error("Invalid argument");
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
		_warnUnrecognizedTags: boolean,
	): DocScript[] {
		return [new DocScript("hi")];
	}
}
@TestFixture("DocumentationGenerator")
export class DocumentationGeneratorFixture {

	public folder: TempDir;

	@SetupFixture
	public setup() {
		this.folder = TempDir.create("folder", {
			"script.gml": "my gml",
		});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@Test("Test")
	public async test() {
		const gmScript = new MockGMScript();
		gmScript.filepath = "script.gml";
		SpyOn(gmScript, "match").andReturn(true);

		const config = new ProjectConfig();
		config.pattern = "foo";

		const gmProject = new MockGMProject("my-project", []);
		gmProject.path = this.folder.dir;

		const container = new Container();
		container.bind<IDocumentationExtractor>(TYPES.IDocumentationExtractor).to(MockDocumentationExtractor);

		const sl = container.resolve(ScriptLoader);

		const output = await sl.load(gmScript, config, gmProject);

		Expect(output[0].name).toBe("hi");
	}
}
