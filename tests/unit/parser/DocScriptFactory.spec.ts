import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import DocReturns from "../../../src/doc_models/DocReturns";
import DocScriptFactory from "../../../src/parser/DocScriptFactory";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocScriptFactory")
export class DocScriptFactoryFixture {

	public factory: DocScriptFactory;

	@Setup
	public setup() {
		this.factory = new DocScriptFactory("my_script");
	}

	@Test("should set the name of the script")
	public name() {
		const script = this.factory.make();
		Expect(script.name).toBe("my_script");
	}

	@Test("Should set the description of the script")
	public description() {
		this.factory.setDescription("my description");
		const script = this.factory.make();
		Expect(script.description).toBe("<p>my description</p>");
	}

	@Test("Should set the script as private")
	public private() {
		this.factory.markPrivate();
		const script = this.factory.make();
		Expect(script.private).toBe(true);
	}

	@Test("Should add a param")
	public param() {
		this.factory.addParam("param1_name", "param1_type", false, "param1_description");
		this.factory.addParam("param2_name", "", true, "param2_description");
		const script = this.factory.make();
		const params = script.params;
		Expect(params.length).toBe(2);

		Expect(params[0].name).toBe("param1_name");
		Expect(params[0].type).toBe("param1_type");
		Expect(params[0].optional).toBe(false);
		Expect(params[0].description).toBe("param1_description");

		Expect(params[1].name).toBe("param2_name");
		Expect(params[1].type).toBeNull();
		Expect(params[1].optional).toBe(true);
		Expect(params[1].description).toBe("param2_description");
	}

	@Test("Should add an example")
	public examples_normal() {
		this.factory.addExample("my_example1");
		this.factory.addExample("my_example2");
		const script = this.factory.make();
		const examples = script.examples;
		Expect(examples.length).toBe(2);
		Expect(examples[0].code).toBe("my_example1");
		Expect(examples[0].caption).toBeNull();
		Expect(examples[1].code).toBe("my_example2");
		Expect(examples[1].caption).toBeNull();
	}

	@Test("Should not add an empty example")
	public examples_empty() {
		this.factory.addExample("");
		const script = this.factory.make();
		const examples = script.examples;
		Expect(examples.length).toBe(0);
	}

	@Test("Should set the function name")
	public function() {
		this.factory.setFunction("my_function");
		const script = this.factory.make();
		Expect(script.function).toBe("my_function");
	}

	@Test("Should set the returns")
	public returns() {
		this.factory.setReturns("return_type", "return_description");
		const script = this.factory.make();
		Expect(script.returns).toBeDefined();
		Expect(script.returns).toEqual(script.return); // return is alias of returns
		Expect((script.returns as DocReturns).type).toBe("return_type");
		Expect((script.returns as DocReturns).description).toBe("return_description");
	}
}
