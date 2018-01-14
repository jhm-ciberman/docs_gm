import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMS2Script from "./GMS2Script";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS2Script")
export class GMS2ScriptFixture {

	public script: GMS2Script;

	@Setup
	public setup() {
		this.script = new GMS2Script({
			id: "my-id",
			name: "my-name",
		});
	}

	@Test("should load a script and get the script content and name through an iterator")
	public subScripts() {
		this.script.loadFromString("my-gml-content");
		const it = this.script.subScripts().next();
		Expect(it.value).toEqual(["my-name", "my-gml-content"]);
		Expect(it.done).toBe(true);
	}

	@Test("should get the filepath of the gml file of a non-compatibility script")
	public filepath_NonCompatibility() {
		this.script.isCompatibility = false;
		Expect(this.script.filepath).toBe("scripts/my-name/my-name.gml");
	}

	@Test("should get the filepath of the gml file of a compatibility script")
	public filepath_Compatibility() {
		this.script.isCompatibility = true;
		Expect(this.script.filepath).toBe("scripts/@my-name/my-name.gml");
	}

	@Test("should throw when calling subScripts() without calling loadFromString")
	public subScripts_Throw() {
		Expect(() => {
			this.script.subScripts().next();
		}).toThrow();
	}

}
