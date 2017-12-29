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
			name: "My design",
			pages: [
				{in: "page.njk", out: "index.html", feedWith: "scripts"},
			],
		},
	},
};

describe("Template", () => {
	beforeAll(() => {
		mock({
			"path/to/template/template.json": JSON.stringify(myTemplateJSON),
		});
	});

	afterAll(() => {
		mock.restore();
	});

	test("should load from a file", () => {
		expect.hasAssertions();
		return Template.loadFrom("path/to/template").then((template) => {
			expect(template.author).toBe("Darth Vader");
			expect(template.web).toBe("http://foo.com/");
			expect(template.description).toBe("My description");
			expect(template.defaultDesign).toBeDefined();
			expect((template.defaultDesign as Design).name).toBe("My design");
			expect(template.folder).toBe(path.resolve("path/to/template"));
		});
	});
});
