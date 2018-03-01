import {
	Expect,
	Setup,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import DocReturns from "../../src/doc_models/DocReturns";
import JSDocParser from "../../src/parser/JSDocParser";

/* tslint:disable:max-classes-per-file completed-docs */
@TestFixture("JSDocParser")
export class JSDocParserFixture {
	public p: JSDocParser;

	@Setup
	public setup() {
		this.p = new JSDocParser();
	}

	@Test("parser should parse an simple description")
	public parser_simple_description() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * This is a simple description",
			" */",
		].join("\n"));
		Expect(doc.description).toBe("<p>This is a simple description</p>");
		Expect(doc.undocumented).toBe(false);
	}

	@Test("parser should parse a description tag")
	public parser_description() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @description ",
			" * This is a simple description",
			" */",
		].join("\n"));
		Expect(doc.description).toBe("<p>This is a simple description</p>");
		Expect(doc.undocumented).toBe(false);
	}

	@Test("parser should parse a private tag")
	public parser_private() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @private ",
			" * This is a private description",
			" */",
		].join("\n"));
		Expect(doc.description).toBe("<p>This is a private description</p>");
		Expect(doc.undocumented).toBe(false);
		Expect(doc.private).toBe(true);
	}

	@Test("parser should parse a simple function tag")
	public parser_function_simple() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @function my_function",
			" */",
		].join("\n"));
		Expect(doc.function).toBe("my_function");
	}

	@Test("parser should parse a function tag with arguments like a function signature")
	public parser_function_complex() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @function my_function(a, b, c)",
			" */",
		].join("\n"));
		Expect(doc.function).toBe("my_function");
	}

	@Test("parser should parse a function tag with arguments like a function signature and empty function name")
	public parser_function_complex_empty() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @function (a, b, c)",
			" */",
		].join("\n"));
		Expect(doc.function).toBe("");
	}

	@Test("parser should reconstruct a description tag")
	public parser_description_reconstruct() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @description {This is} [The] description",
			" */",
		].join("\n"));
		Expect(doc.description).toBe("<p>{This is} [The] description</p>");
	}

	@Test("parser should parse an empty description tag as undocumented")
	public parser_description_empty() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @description ",
			" */",
		].join("\n"));
		Expect(doc.description).toBeNull();
		Expect(doc.undocumented).toBe(true);
	}

	@Test("parser should warn with an inexistent tag when warnUnrecognizedTags=true")
	public parser_warn_on_inexistent() {
		SpyOn(this.p.reporter, "warn");
		this.p.warnUnrecognizedTags = true;
		const doc = this.p.parse("my_script", [
			"/**",
			" * @inexistent a b c",
			" */",
		].join("\n"));
		Expect(doc.undocumented).toBe(true);
		Expect(this.p.reporter.warn).toHaveBeenCalled();
	}
	@Test("parser should NOT warn with an inexistent tag when warnUnrecognizedTags=false")
	public parser_not_warn_on_inexistent() {
		SpyOn(this.p.reporter, "warn");
		this.p.warnUnrecognizedTags = false;
		const doc = this.p.parse("my_script", [
			"/**",
			" * @inexistent a b c",
			" */",
		].join("\n"));
		Expect(doc.undocumented).toBe(true);
		Expect(this.p.reporter.warn).not.toHaveBeenCalled();
	}

	@Test("parser should parse a returns tag")
	public parser_returns() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @returns {string} The returned string",
			" */",
		].join("\n"));
		Expect(doc.returns).toBeDefined();
		Expect((doc.returns as DocReturns).description).toBe("The returned string");
		Expect((doc.returns as DocReturns).type).toBe("string");
		Expect(doc.undocumented).toBe(false);
	}

	@Test("parser should parse an example tag")
	public parser_example() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @example my_script(a, b, c);",
			" * @example ",
			" * my_script(1, 2, 3);",
			" */",
		].join("\n"));
		Expect(doc.examples.length).toBe(2);
		Expect(doc.examples[0].caption).toBeNull();
		Expect(doc.examples[0].code).toBe("my_script(a, b, c);");
		Expect(doc.examples[1].caption).toBeNull();
		Expect(doc.examples[1].code).toBe("my_script(1, 2, 3);");
		Expect(doc.undocumented).toBe(false);
		Expect(doc.undocumented).toBe(false);
	}

	@Test("parser should parse a param tag")
	public parser_param() {
		const doc = this.p.parse("my_script", [
			"/**",
			" * @param {string} name The name of the character",
			" * @param         [jump] If the character should jump",
			" * @param multiline This is a",
			" * multiline description.",
			" */",
		].join("\n"));
		Expect(doc.params.length).toBe(3);

		Expect(doc.params[0].name).toBe("name");
		Expect(doc.params[0].description).toBe("The name of the character");
		Expect(doc.params[0].type).toBe("string");
		Expect(doc.params[0].optional).toBe(false);

		Expect(doc.params[1].name).toBe("jump");
		Expect(doc.params[1].description).toBe("If the character should jump");
		Expect(doc.params[1].type).toBeNull();
		Expect(doc.params[1].optional).toBe(true);

		Expect(doc.params[2].name).toBe("multiline");
		Expect(doc.params[2].description).toBe("This is a\nmultiline description.");
		Expect(doc.params[2].type).toBeNull();
		Expect(doc.params[2].optional).toBe(false);

		Expect(doc.undocumented).toBe(false);
	}

}
