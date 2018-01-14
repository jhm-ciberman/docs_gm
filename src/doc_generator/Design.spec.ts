import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

/* tslint:disable:max-classes-per-file completed-docs */

import * as fse from "fs-extra";
import * as mock from "mock-fs";
import DocProject from "../docs_models/DocProject";
import Design from "./Design";
import { IDesign } from "./TemplateJSON";

@TestFixture("Design")
export class DesignFixture {

	@Test()
	public test() {
		Expect(true).toBe(true);
	}

	@SetupFixture
	public setupFixture() {
		mock({
			"path/to/template/": {
				"page1.njk": "<h1>Hello world {{ page.project.name }}</h1>",
				"page2.njk": "<h1>Bye world {{ page.project.name }}</h1>",
				"foo.bar": "foo",
				"myfolder/foo/bar.baz": "foo",
				"myotherfolder/bar.baz": "foo",
				"do_not_copy.txt": "NO",
			},
		});
	}

	@TeardownFixture
	public teardownFixture() {
		mock.restore();
	}

	@AsyncTest("should render an output file for each onepage page")
	public async shouldRenderOuputForEachOnepagePage() {
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [
				{ in: "page1.njk", out: "a.html", feedWith: "scripts" },
				{ in: "page2.njk", out: "b.html", feedWith: "scripts" },
			],
		};
		const design = new Design("myDesign", "path/to/template", myDesignData);
		const docProject = new DocProject();
		docProject.name = "foo";
		await design.renderPages("out", docProject);
		Expect(fse.readFileSync("out/a.html", "utf8")).toBe("<h1>Hello world foo</h1>");
		Expect(fse.readFileSync("out/b.html", "utf8")).toBe("<h1>Bye world foo</h1>");
	}

	@AsyncTest("should copy files by default")
	public async copyFiles() {
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [],
		};
		const design = new Design("myDesign", "path/to/template", myDesignData);
		await design.copyFiles("out");
		Expect(fse.readFileSync("out/foo.bar", "utf8")).toBe("foo");
	}

	@AsyncTest("should copy only the specified glob files")
	public async copyGlobFiles() {
		// const myDesignData: IDesign = {
		// 	displayName: "My design",
		// 	copy: ["**/myfolder/**/*", "**/myotherfoler/ *"],
		// 	 pages: [],
		// };

		// const design = new Design("myDesign", "path/to/template", myDesignData);
		// await design.copyFiles("out");

		// Expect(fse.existsSync("myfolder/foo/bar.baz")).toBe(true);
		// Expect(fse.readFileSync("myfolder/foo/bar.baz", "utf8")).toBe("foo");

		// Expect(fse.existsSync("myotherfolder/bar.baz")).toBe(true);
		// Expect(fse.readFileSync("myotherfolder/bar.baz", "utf8")).toBe("foo");

		// Expect(fse.existsSync("do_not_copy.txt")).toBe(false);
	}
}
