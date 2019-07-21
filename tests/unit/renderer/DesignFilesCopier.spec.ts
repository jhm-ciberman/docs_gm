import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestCase,
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

	public outFolder: TempDir;

	@Setup
	public setup() {
		this.outFolder = TempDir.create("folder");
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("Test normal")
	public async test_normal() {
		const folder = TempDir.create("folder", {
			"a.txt": "my txt",
			"b.txt": "my other txt",
		});

		const container = new Container();
		const dfc = container.resolve(DesignFilesCopier);
		const template = new MockTemplate();
		template.folder = folder.dir;
		const design = new Design(template, { displayName: "My design", index: "foo.bar"});
		design.copy = ["**/*"];
		await dfc.copy(this.outFolder.dir, design);
		Expect(this.outFolder.read("a.txt")).toBe("my txt");
		Expect(this.outFolder.read("b.txt")).toBe("my other txt");
	}

	@TestCase("package.json", false)
	@TestCase("index.njk", false)
	@TestCase("template.json", false)
	@TestCase("package-lock.json", false)
	@TestCase(".gitignore", false)
	@TestCase("subfolder/package.json", false)
	@TestCase("subfolder/index.njk", false)
	@TestCase("subfolder/template.json", false)
	@TestCase("subfolder/package-lock.json", false)
	@TestCase("subfolder/.gitignore", false)
	@Test("Test ignore files")
	public async test_shouldNotCopyIgnoredFiles(file: string, expected: boolean) {
		const folder = TempDir.create("folder", {
			"a.txt": "my txt",
		});
		folder.addFile(file, "{}");

		const container = new Container();
		const dfc = container.resolve(DesignFilesCopier);
		const template = new MockTemplate();
		template.folder = folder.dir;
		const design = new Design(template, { displayName: "My design", index: "foo.bar" });
		await dfc.copy(this.outFolder.dir, design);
		Expect(folder.exists(file)).toBe(true);
		Expect(this.outFolder.exists(file)).toBe(expected);
		Expect(this.outFolder.exists("a.txt")).toBe(true);
	}
}
