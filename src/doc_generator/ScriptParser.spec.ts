import {
	Expect,
	SetupFixture,
	Test,
	TestFixture,
} from "alsatian";

import OutputConfig from "./OutputConfig";
import ScriptParser from "./ScriptParser";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ScriptParser")
export class ScriptParserFixture {

	public parser: ScriptParser;

	@SetupFixture
	public setupFixture() {
		const config = new OutputConfig();
		this.parser = new ScriptParser(config);
	}

	@Test("Test")
	public test() {
		Expect(true).toBe(true);
	}
}
