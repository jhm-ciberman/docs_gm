import * as mock from "mock-fs";

import * as fse from "fs-extra";
import DocProject from "../docs_models/DocProject";
import Design from "./Design";
import { IDesign } from "./templateJSON";

describe("Design", () => {
	beforeAll(() => {
		console.log("Hi");
		mock({
			"path/to/template/" : {
				"page1.njk": "<h1>Hello world {{ page.project.name }}</h1>",
				"page2.njk": "<h1>Bye world {{ page.project.name }}</h1>",
				"foo.bar": "foo",
				"myfolder/foo/bar.baz": "foo",
				"myotherfolder/bar.baz": "foo",
				"do_not_copy.txt": "NO",
			},
		});
	});

	afterAll(() => {
		mock.restore();
	});

	test("should render an output file for each onepage page", () => {
		expect.hasAssertions();
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
		return design.renderPages("out", docProject).then(() => {
			expect(fse.readFileSync("out/a.html", "utf8")).toBe("<h1>Hello world foo</h1>");
			expect(fse.readFileSync("out/b.html", "utf8")).toBe("<h1>Bye world foo</h1>");
		});
	});

	test("should copy files by default", () => {
		expect.hasAssertions();
		const myDesignData: IDesign = {
			displayName: "My design",
			pages: [],
		};
		const design = new Design("myDesign", "path/to/template", myDesignData);
		return design.copyFiles("out").then(() => {
			expect(fse.readFileSync("out/foo.bar", "utf8")).toBe("foo");
		});
	});

	test("should copy only the specified glob files", () => {
		expect.hasAssertions();
		const myDesignData: IDesign = {
			displayName: "My design",
			copy: ["**/myfolder/**/*", "**/myotherfoler/*"],
			pages: [],
		};
		const design = new Design("myDesign", "path/to/template", myDesignData);
		return design.copyFiles("out").then(() => {
			expect(fse.existsSync("myfolder/foo/bar.baz")).toBe(true);
			expect(fse.readFileSync("myfolder/foo/bar.baz", "utf8")).toBe("foo");

			expect(fse.existsSync("myotherfolder/bar.baz")).toBe(true);
			expect(fse.readFileSync("myotherfolder/bar.baz", "utf8")).toBe("foo");

			expect(fse.existsSync("do_not_copy.txt")).toBe(false);
		});
	});
});
