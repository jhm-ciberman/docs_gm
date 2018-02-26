import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";
import { TempDir } from "../_testing_helpers/TempDir.help";

import IGMFolder from "../gm_project/interfaces/IGMFolder";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IGMResource from "../gm_project/interfaces/IGMResource";

import ProjectConfig from "../config/models/ProjectConfig";
import GMScript from "../gm_project/common/GMScript";
import DocProjectGenerator from "./DocProjectGenerator";

/* tslint:disable:max-classes-per-file completed-docs */

class GMScriptMock extends GMScript {
	public filepath: string;
	public parent: IGMFolder | null = null;
	constructor(name: string, filepath: string) {
		super(name);
		this.filepath = filepath;
	}
	public * subScripts(): IterableIterator<[string, string]> {
		const gml = [
			"/**",
			" * My documentation ",
			" */",
		];
		yield ["my-script", gml.join("\n")];
	}
	public loadFromString(str: string): void {
		if (str !== "a" && str !== "b") {
			throw new Error("Invalid arguments to mock loadFromString");
		}
	}
}

class GMFolderMock implements IGMFolder {

	public parent: IGMFolder | null = null;
	public name: string;
	public fullpath: string = "";
	public mockChildren: IGMResource[];
	constructor(name: string, mockChildren: IGMResource[]) {
		this.name = name;
		this.mockChildren = mockChildren;
	}
	get children(): IterableIterator<IGMResource> {
		return this.mockChildren[Symbol.iterator]();
	}
	public addChild(_child: IGMResource): void {
		throw new Error("Method not implemented.");
	}
	public getSubtreeLeafs(): IGMResource[] {
		throw new Error("Method not implemented.");
	}
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}
}

class GMProjectMock extends GMFolderMock implements IGMProject {
	public fullpath: string;
	public parent: IGMFolder | null;
	public path: string = "";
	public mockChildren: IGMFolder[];
	constructor(name: string, mockChildren: IGMFolder[]) {
		super(name, mockChildren);
	}
	get children(): IterableIterator<IGMFolder> {
		return this.mockChildren[Symbol.iterator]();
	}
}

@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	public projectDir: TempDir;

	@SetupFixture
	public setup() {
		this.projectDir = TempDir.create("my-project", {
			"a.gml": "a",
			"b.gml": "b",
		});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}
	@AsyncTest("generate")
	public async generate_normal() {
		const a = new GMScriptMock("a", "a.gml");
		const b = new GMScriptMock("b", "b.gml");
		const scriptsFolder = new GMFolderMock("scripts", [a, b]);

		const p = new GMProjectMock("my-project", [scriptsFolder]);
		p.path = this.projectDir.dir;

		const generator = new DocProjectGenerator(p, new ProjectConfig());
		const doc = await generator.generate();
		Expect(doc.name).toBe("my-project");
		Expect(doc.scripts.children.length).toBe(2);
	}
}
