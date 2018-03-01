import {
	Expect,
	Setup,
	Test,
} from "alsatian";

import Template from "../../src/template/Template";
import { myTemplateJSON } from "./__mock__/TemplateJSON.mock";

/* tslint:disable:max-classes-per-file completed-docs */

export class TemplateFixture {
	public template: Template;

	@Setup
	public setup() {
		this.template = Template.create(myTemplateJSON, "path/to/template");
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

	@Test("create should thrown when an invalid defaultDesign is in the json")
	public create_invalidDefaultDesign() {
		const invalidJSON = Object.create(myTemplateJSON);
		invalidJSON.defaultDesign = "invalid_default_design_name";
		Expect(() => {
			Template.create(invalidJSON, "path/to/template");
		}).toThrow();
	}
}
