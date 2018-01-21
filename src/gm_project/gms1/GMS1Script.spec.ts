import {
	AsyncTest,
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMS1Script from "./GMS1Script";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS1Script")
export class GMS1ScriptFixture {

	public script: GMS1Script;

	@Setup
	public setup() {
		this.script = new GMS1Script("path/to/my_script.gml");
	}

	@Test("should get the filepath")
	public filepath() {
		Expect(this.script.filepath).toBe("path/to/my_script.gml");
	}

	@AsyncTest("should loadFromString() multiple scripts")
	public async loadFromString_multipleScripts() {
		const mockGML = [
			"#define my_script_1",
			"return \"foo\";",
			"#define my_script_2",
			"return \"bar\";",
		];
		const script = await this.script.loadFromString(mockGML.join("\n"));
		const arr = Array.from(script.subScripts());
		Expect(arr.length).toEqual(2);
		Expect(arr[0]).toEqual(["my_script_1", 'return "foo";']);
		Expect(arr[1]).toEqual(["my_script_2", 'return "bar";']);
	}

	@AsyncTest("should loadFromString() single script")
	public async loadFromString_singleScript() {
		const script = await this.script.loadFromString("return \"foo\";");
		const arr = Array.from(script.subScripts());
		Expect(arr.length).toEqual(1);
		Expect(arr[0]).toEqual(["my_script", 'return "foo";']);
	}

	@Test("should throw when calling subScripts() without calling loadFromString")
	public subScripts_Throw() {
		Expect(() => {
			this.script.subScripts().next();
		}).toThrow();
	}

}
