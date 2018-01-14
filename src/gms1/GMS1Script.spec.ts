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
		const [name1, gml1] = it.next().value;
		Expect(name1).toBe("my_script_1");
		Expect(gml1).toBe('return "foo";');

		const [name2, gml2] = it.next().value;
		Expect(name2).toBe("my_script_2");
		Expect(gml2).toBe('return "bar";');
	}

}
