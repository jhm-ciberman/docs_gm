import {
	AsyncTest,
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMS1Script from "../../../src/gm_project/gms1/GMS1Script";

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

	@AsyncTest("subScripts() should generate multiple SubScripts")
	public async subScripts_multipleScripts() {
		const mockGML = [
			"#define my_script_1",
			"return \"foo\";",
			"#define my_script_2",
			"return \"bar\";",
		];
		const arr = Array.from(this.script.subScripts(mockGML.join("\n")));
		Expect(arr.length).toEqual(2);
		Expect(arr[0].name).toEqual("my_script_1");
		Expect(arr[0].text).toEqual('return "foo";');
		Expect(arr[1].name).toEqual("my_script_2");
		Expect(arr[1].text).toEqual('return "bar";');
	}

	@AsyncTest("subScripts() should generate single SubScripts")
	public async subScripts_singleScript() {
		const arr = Array.from(this.script.subScripts("return \"foo\";"));
		Expect(arr.length).toEqual(1);
		Expect(arr[0].name).toEqual("my_script");
		Expect(arr[0].text).toEqual('return "foo";');
	}
}
