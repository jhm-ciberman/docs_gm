import {
	AsyncSetupFixture,
	AsyncTeardownFixture,
	AsyncTest,
	Expect,
	Test,
	TestFixture,
} from "alsatian";

/* tslint:disable:max-classes-per-file completed-docs */

import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";
import DocProject from "../docs_models/DocProject";
import Design from "./Design";
import { IDesign } from "./TemplateJSON";

@TestFixture("Design")
export class DesignFixture {

	public tmpInput: string;
	public tmpOutput: string;

	@Test()
	public test() {
		Expect(true).toBe(true);
	}

	@AsyncSetupFixture
	public async setupFixture() {
		this.tmpInput = path.join(os.tmpdir(), "path/to/template");
		await fse.emptyDir(this.tmpInput);
		this.tmpOutput = path.join(os.tmpdir(), "out");
		await fse.emptyDir(this.tmpOutput);

		const files: { [key: string]: string } = {
			"page1.njk": "<h1>Hello world {{ page.project.name }}</h1>",
			"page2.njk": "<h1>Bye world {{ page.project.name }}</h1>",
			"foo.bar": "foo",
			"myfolder/foo/bar.baz": "foo",
			"myotherfolder/bar.baz": "foo",
		};

		for (const key of Object.keys(files)) {
			await fse.outputFile(path.join(this.tmpInput, key), files[key]);
		}
	}

	@AsyncTeardownFixture
	public async teardownFixture() {
		await fse.remove(this.tmpInput);
		await fse.remove(this.tmpOutput);
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
		const design = new Design("myDesign", this.tmpInput, myDesignData);
		const docProject = new DocProject();
		docProject.name = "foo";
		await design.renderPages(this.tmpOutput, docProject);

		const a = fse.readFileSync(path.join(this.tmpOutput, "a.html"), "utf8");
		Expect(a).toBe("<h1>Hello world foo</h1>");

		const b = fse.readFileSync(path.join(this.tmpOutput, "b.html"), "utf8");
		Expect(b).toBe("<h1>Bye world foo</h1>");
	}

	@AsyncTest("should copy files by default")
	public async copyFiles() {
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [],
		};
		const design = new Design("myDesign", this.tmpInput, myDesignData);
		await design.copyFiles(this.tmpOutput);

		const foo = fse.readFileSync(path.join(this.tmpOutput, "foo.bar"), "utf8");
		Expect(foo).toBe("foo");
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
