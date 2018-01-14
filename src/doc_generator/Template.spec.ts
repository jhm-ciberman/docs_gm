import {
	AsyncTest,
	Expect,
	Setup,
	SetupFixture,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

import * as mock from "mock-fs";
import * as path from "path";
import Design from "./Design";
import Template from "./Template";
import { IRoot } from "./templateJSON";

/* tslint:disable:max-classes-per-file completed-docs */

const myTemplateJSON: IRoot = {
	author: "Darth Vader",
	web: "http://foo.com/",
	description: "My description",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: "scripts" },
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

@TestFixture("Template (Static)")
export class TemplateStaticFixture {
	@SetupFixture
	public setupFixture() {
		mock({
			"path/to/template/template.json": JSON.stringify(myTemplateJSON),
			"path/to/template/page.njk": "<h1>Hello world</h1>",
		});
	}

	@TeardownFixture
	public teardownFixture() {
		mock.restore();
	}

	@AsyncTest("should load template from a file")
	public async loadFrom() {
		const template = await Template.loadFrom("path/to/template");

		Expect(template.author).toBe("Darth Vader");
		Expect(template.web).toBe("http://foo.com/");
		Expect(template.description).toBe("My description");
		Expect(template.defaultDesign).toBeDefined();
		Expect((template.defaultDesign as Design).name).toBe("myDesign");
		Expect((template.defaultDesign as Design).displayName).toBe("My design");
		Expect(template.folder).toBe(path.resolve("path/to/template"));
	}
}

/* tslint:disable:max-classes-per-file */

export class TemplateFixture {
	public template: Template;

	@Setup
	public setup() {
		this.template = new Template(myTemplateJSON, "path/to/template");
	}

	@Test("getDesign() should return the Design instance of the design with that name")
	public getDesign_Exists() {
		const design = this.template.getDesign("myOtherDesign");
		Expect(design.name).toBe("myOtherDesign");
	}

	@Test("getDesign() should return the default design instance when the design does not exists")
	public tgetDesign_NotExistsst() {
		const design = this.template.getDesign("non_existent_design");
		Expect(design).toBe(this.template.defaultDesign);
		Expect(design.name).toBe("myDesign");
	}

	@Test("hasDesign() should return if a design exists")
	public hasDesign() {
		Expect(this.template.hasDesign("myDesign")).toBe(true);
		Expect(this.template.hasDesign("myOtherDesign")).toBe(true);
		Expect(this.template.hasDesign("non_existent_design")).toBe(false);
	}

	@Test("designs() should iterate over the designs")
	public designs() {
		const arr: string[] = [];
		for (const design of this.template.designs()) {
			arr.push(design.name);
		}
		Expect(arr.length).toBe(2);
		Expect(arr).toContain("myDesign");
		Expect(arr).toContain("myOtherDesign");
	}
}
