import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DesignFilesCopier from "../../../src/renderer/DesignFilesCopier";
import Design from "../../../src/template/Design";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import MockTemplate from "../__mock__/MockTemplate.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DesignFilesCopierFixture")
export class DesignFilesCopierFixture {

	public folder: TempDir;
	public outFolder: TempDir;

	@SetupFixture
	public setup() {
		this.folder = TempDir.create("folder", {
			"a.txt": "my txt",
			"b.txt": "my other txt",
		});
		this.outFolder = TempDir.create("folder");
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("Test normal")
	public async test_normal() {
		const container = new Container();
		const dfc = container.resolve(DesignFilesCopier);
		const template = new MockTemplate();
		template.folder = this.folder.dir;
		const design = new Design(template, { displayName: "My design", index: "foo.bar"});
		design.copy = ["**/*"];
		await dfc.copy(this.outFolder.dir, design);
		Expect(this.outFolder.read("a.txt")).toBe("my txt");
		Expect(this.outFolder.read("b.txt")).toBe("my other txt");
	}
}
