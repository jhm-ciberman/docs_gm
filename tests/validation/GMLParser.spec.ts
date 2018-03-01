import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";

import GMLParser from "../../src/validation/GMLParser";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMLParser")
export class GMLParserFixture {

	@TestCase("sprite_index = argument0;", 1)
	@TestCase("argument1;argument0", 2)
	@TestCase("(argument2)", 3)
	@TestCase("argument1000", 1001)
	@TestCase("{argument12}", 13)
	@TestCase("\"argument12\"", 0)
	@TestCase("//argument12", 0)
	@TestCase("/*argument12*/", 0)
	@Test("countFixedArguments should count the number of fixed arguments")
	public countFixedArguments(gml: string, expected: number) {
		const parser = new GMLParser(gml);
		Expect(parser.countFixedArguments()).toBe(expected);
	}

	@TestCase("sprite_index = argument[0];", 1)
	@TestCase("argument[1];argument[0]", 2)
	@TestCase("(argument[2])", 3)
	@TestCase("argument[1000]", 1001)
	@TestCase("{argument[12]}", 13)
	@TestCase("\"argument[12]\"", 0)
	@TestCase("//argument[12]", 0)
	@TestCase("/*argument[12]*/", 0)
	@Test("countOptionalArguments should count the number of optional arguments")
	public countOptionalArguments(gml: string, expected: number) {
		const parser = new GMLParser(gml);
		Expect(parser.countOptionalArguments()).toBe(expected);
	}

	@TestCase("return true;", true)
	@TestCase("returned = a", false)
	@TestCase("isreturn = a", false)
	@TestCase("a\nb\nreturn\nc = a", true)
	@TestCase("(return);", true)
	@TestCase("(return\ncode)", true)
	@TestCase("(a\nreturn)", true)
	@TestCase("{return\ncode\n}", true)
	@TestCase("\"hello;return;string\"", false)
	@TestCase("//hello;return;comment", false)
	@TestCase("/*hello;return;comment*/", false)
	@Test("hasReturn should detect if the code has a return statement")
	public hasReturn(gml: string, expected: boolean) {
		const parser = new GMLParser(gml);
		Expect(parser.hasReturn()).toBe(expected);
	}
}
