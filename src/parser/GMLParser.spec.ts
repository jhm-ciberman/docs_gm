import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import GMLParser from "./GMLParser";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMLParser")
export class GMLParserFixture {

	@Test("countFixedArguments should count the number of fixed arguments")
	public countFixedArguments() {
		const parser = new GMLParser("sprite_index = argument0;");
		Expect(parser.countFixedArguments()).toBe(1);
	}

	@Test("countOptionalArguments should count the number of optional arguments")
	public countOptionalArguments() {
		const parser = new GMLParser("sprite_index = argument[0];");
		Expect(parser.countOptionalArguments()).toBe(1);
	}

	@Test("hasReturn should detect if the code has a return statement")
	public hasReturn() {
		const parser = new GMLParser("return true;");
		Expect(parser.hasReturn()).toBe(true);
	}
}
