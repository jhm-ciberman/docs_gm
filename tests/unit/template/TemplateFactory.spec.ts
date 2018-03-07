import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import Design from "../../../src/template/entities/Design";
import { PageFeedWith } from "../../../src/template/enums/PageFeedWith";
import { IRoot } from "../../../src/template/interfaces/TemplateJSON";
import TemplateFactory from "../../../src/template/TemplateFactory";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("TemplateFactory")
export class TemplateFactoryFixture {

	@Test("TemplateFactory")
	public TemplateFactory() {
		const container = new Container();
		const tf = container.resolve(TemplateFactory);

		const t = tf.create("foo_folder", this._getMockJSON());
		Expect(t.folder).toBe("foo_folder");
		Expect(t.author).toBe("Darth Vader");
		Expect(t.description).toBe("My description");
		Expect(t.web).toBe("http://myweb.com/");

		const design: Design = t.getDesign("myDesign") as Design;
		Expect(design).toBeDefined();

		Expect(design.displayName).toBe("My design name");
		Expect(design.copy[0]).toBe("aaa");
		Expect(Array.from(design.pages)[0].in).toBe("foo");
		Expect(Array.from(design.pages)[0].out).toBe("bar");
		Expect(Array.from(design.pages)[0].feedWith).toBe(PageFeedWith.Scripts);

		Expect(t.defaultDesign).toBe(design);
		Expect(t.hasDesign("myDesign")).toBe(true);
		Expect(Array.from(t.designs())[0]).toBe(design);
	}

	@Test("TemplateFactory_invalid_defaultDesign")
	public TemplateFactory_invalid_defaultDesign() {
		const container = new Container();
		const tf = container.resolve(TemplateFactory);

		const json = this._getMockJSON();
		json.defaultDesign = "non_existent_design";
		Expect(() => tf.create("foo_folder", json)).toThrow();
	}

	@Test("TemplateFactory_no_copy_parameter")
	public TemplateFactory_no_copy_parameter() {
		const container = new Container();
		const tf = container.resolve(TemplateFactory);

		const json = this._getMockJSON();
		json.designs.myDesign.copy = undefined;

		const t = tf.create("foo_folder", json);
		const expected = ["**/*", "!template.json", "!*.njk", "!package.json"];
		Expect((t.getDesign("myDesign") as Design).copy).toEqual(expected);
	}

	private _getMockJSON(): IRoot {
		return {
			author: "Darth Vader",
			description: "My description",
			web: "http://myweb.com/",
			defaultDesign: "myDesign",
			designs: {
				myDesign: {
					displayName: "My design name",
					copy: ["aaa"],
					pages: [{
						in: "foo",
						out: "bar",
						feedWith: PageFeedWith.Scripts,
					}],
				},
			},
		};
	}

}
