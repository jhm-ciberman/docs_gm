import {
	AsyncSetupFixture,
	AsyncTeardownFixture,
	AsyncTest,
	Expect,
	TestFixture,
} from "alsatian";

/* tslint:disable:max-classes-per-file completed-docs */

import { TempDir } from "../_testing_helpers/TempDir.help";
import DocProject from "../doc_models/DocProject";
import Design from "./Design";
import { PageFeedWith } from "./enums/PageFeedWith";
import { IDesign } from "./interfaces/TemplateJSON";

@TestFixture("Design")
export class DesignFixture {

	public in: TempDir;
	public out: TempDir;

	@AsyncSetupFixture
	public async setupFixture() {
		const files: { [key: string]: string } = {
			"page1.njk": "<h1>Hello world {{ page.project.name }}</h1>",
			"page2.njk": "<h1>Bye world {{ page.project.name }}</h1>",
			"foo.bar": "foo",
			"myfolder/foo/bar.baz": "foo",
			"myotherfolder/bar.baz": "foo",
		};

		this.in = TempDir.create("path/to/template", files);
		this.out = TempDir.create("out");
	}

	@AsyncTeardownFixture
	public async teardownFixture() {
		await TempDir.removeAll();
	}

	@AsyncTest("should render an output file for each onepage page")
	public async shouldRenderOutputForEachOnepagePage() {
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [
				{ in: "page1.njk", out: "a.html", feedWith: PageFeedWith.Scripts },
				{ in: "page2.njk", out: "b.html", feedWith: PageFeedWith.Scripts },
			],
		};
		const design = new Design("myDesign", this.in.dir, myDesignData);
		const docProject = new DocProject("foo");

		await design.renderPages(this.out.dir, docProject);

		Expect(this.out.read("a.html")).toBe("<h1>Hello world foo</h1>");
		Expect(this.out.read("b.html")).toBe("<h1>Bye world foo</h1>");
	}

	@AsyncTest("should copy files by default")
	public async copyFiles() {
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [],
		};
		const design = new Design("myDesign", this.in.dir, myDesignData);
		await design.copyFiles(this.out.dir);

		Expect(this.out.read("foo.bar")).toBe("foo");
	}

	@AsyncTest("should copy only the specified glob files")
	public async copyGlobFiles() {
		const myDesignData: IDesign = {
			displayName: "My design",
			copy: ["**/myfolder/**/*", "**/myotherfoler/*"],
			pages: [],
		};

		const design = new Design("myDesign", this.in.dir, myDesignData);
		await design.copyFiles(this.out.dir);

		Expect(this.out.read("myfolder/foo/bar.baz")).toBe("foo");
		Expect(this.out.read("myotherfolder/bar.baz")).toBe("foo");
		Expect(this.out.exists("do_not_copy.txt")).toBe(false);
	}
}
