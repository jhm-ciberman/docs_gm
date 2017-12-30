import * as mock from "mock-fs";
import * as path from "path";
import Design from "./Design";
import Template from "./Template";
import { IRoot } from "./templateJSON";

const myTemplateJSON: IRoot = {
	author: "Darth Vader",
	web: "http://foo.com/",
	description: "My description",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design",
			pages: [
				{in: "page.njk", out: "index.html", feedWith: "scripts"},
			],
		},
		myOtherDesign: {
			displayName: "My Other design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: "scripts" },
			],
		},
	},
};

describe("Template (static)", () => {
	beforeAll(() => {
		mock({
			"path/to/template/template.json": JSON.stringify(myTemplateJSON),
			"path/to/template/page.njk": "<h1>Hello world</h1>",
		});
	});

	afterAll(() => {
		mock.restore();
	});

	test("should load template from a file", () => {
		expect.hasAssertions();
		return Template.loadFrom("path/to/template").then((template) => {
			expect(template.author).toBe("Darth Vader");
			expect(template.web).toBe("http://foo.com/");
			expect(template.description).toBe("My description");
			expect(template.defaultDesign).toBeDefined();
			expect((template.defaultDesign as Design).name).toBe("myDesign");
			expect((template.defaultDesign as Design).displayName).toBe("My design");
			expect(template.folder).toBe(path.resolve("path/to/template"));
		});
	});
});

describe("Template", () => {
	const template = new Template(myTemplateJSON, "path/to/template");
	test("getDesign() should return the Design instance of the design with that name", () => {
		const design = template.getDesign("myOtherDesign");
		expect(design.name).toBe("myOtherDesign");
	});

	test("getDesign() should return the default design instance when the design does not exists", () => {
		const design = template.getDesign("non_existent_design");
		expect(design).toBe(template.defaultDesign);
		expect(design.name).toBe("myDesign");
	});

	test("hasDesign() should return if a design exists", () => {
		expect(template.hasDesign("myDesign")).toBe(true);
		expect(template.hasDesign("myOtherDesign")).toBe(true);
		expect(template.hasDesign("non_existent_design")).toBe(false);
	});

	test("designs() should iterate over the designs", () => {
		const arr: string[] = [];
		for (const design of template.designs()) {
			arr.push(design.name);
		}
		expect(arr.length).toBe(2);
		expect(arr).toContain("myDesign");
		expect(arr).toContain("myOtherDesign");

	});
});
