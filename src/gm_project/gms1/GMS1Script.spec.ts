import {
	AsyncTest,
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import GMS1Script from "./GMS1Script";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS1Script")
export class GMS1ScriptFixture {
	public script = new GMS1Script("path/to/my_script.gml", null);

	@Test("should get the filepath")
	public filepath() {
		Expect(this.script.filepath).toBe("path/to/my_script.gml");
	}

	@AsyncTest("should loadFromString() multiple scripts")
	public async loadFromString() {
		const mockGML = [
			"#define my_script_1",
			"return \"foo\";",
			"#define my_script_2",
			"return \"bar\";",
		];
		const script = await this.script.loadFromString(mockGML.join("\n"));
		const it = script.subScripts();

		const result1 = it.next();
		Expect(result1.done).toBe(false);
		Expect(result1.value).toEqual(["my_script_1", 'return "foo";']);

		const result2 = it.next();
		Expect(result2.done).toBe(false);
		Expect(result2.value).toEqual(["my_script_2", 'return "bar";']);

		const result3 = it.next();
		Expect(result3.done).toBe(true);
	}

}
