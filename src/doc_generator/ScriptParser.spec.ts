import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ScriptParser")
export class ScriptParserFixture {
	@Test("Test")
	public test() {
		Expect(true).toBe(true);
	}
}
