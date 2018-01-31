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
import IGMScript from "../gm_project/interfaces/IGMScript";

import ProjectConfig from "../config/models/ProjectConfig";
import DocProjectGenerator from "./DocProjectGenerator";

/* tslint:disable:max-classes-per-file completed-docs */

class GMScriptMock implements IGMScript {
	public filepath: string;
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
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

class GMProjectMock implements IGMProject {
	public path: string;
	public name: string;
	public parent: IGMFolder | null;
	public fullpath: string;
	public children: IterableIterator<IGMFolder>;
	public find(_pattern: string): IGMResource[] {
		const a = new GMScriptMock();
		a.filepath = "a.gml";
		const b = new GMScriptMock();
		b.filepath = "b.gml";
		return [a, b];
	}
	public addChild(_child: IGMFolder): void {
		throw new Error("Method not implemented.");
	}
	public getSubtreeLeafs(): IGMResource[] {
		throw new Error("Method not implemented.");
	}
}

class GMProjectEmptyMock implements IGMProject {
	public path: string;
	public name: string;
	public children: IterableIterator<IGMFolder>;
	public fullpath: string;
	public parent: IGMFolder | null;
	public find(_pattern: string): IGMResource[] {
		return [];
	}
	public addChild(_child: IGMFolder): void {
		throw new Error("Method not implemented.");
	}
	public getSubtreeLeafs(): IGMResource[] {
		throw new Error("Method not implemented.");
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
		const generator = new DocProjectGenerator();
		const p = new GMProjectMock();
		p.name = "my-project";
		p.path = this.projectDir.dir;

		const doc = await generator.generate(p, new ProjectConfig());
		Expect(doc.name).toBe("my-project");
		Expect(doc.scripts.length).toBe(2);
	}

	@AsyncTest("generate should thrown an error when no scripts are found")
	public async generate_empty() {
		const generator = new DocProjectGenerator();
		const p = new GMProjectEmptyMock();
		p.name = "my-project";
		p.path = this.projectDir.dir;

		await generator.generate(p, new ProjectConfig()).then(() => {
			throw new Error("generate() did not throw on no scripts found");
		}).catch((e: Error) => {
			Expect(e).toBeDefined();
			Expect(e.message).toBeDefined();
			Expect(e.message.toLowerCase()).toContain("no resources found");
		});
	}
}
