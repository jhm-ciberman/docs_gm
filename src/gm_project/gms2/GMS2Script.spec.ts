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
		this.script = new GMS2Script("my-name");
	}

	@Test("should load a script and get the script content and name through an iterator")
	public subScripts() {
		this.script.loadFromString("my-gml-content");
		const arr = Array.from(this.script.subScripts());
		Expect(arr.length).toBe(1);
		Expect(arr[0][0]).toBe("my-name");
		Expect(arr[0][1]).toBe("my-gml-content");
	}

	@Test("should convert triple slash comments into JSdoc comments")
	public subScripts_triple_slash() {
		this.script.loadFromString("/// Hi");
		const arr = Array.from(this.script.subScripts());
		Expect(arr.length).toBe(1);
		Expect(arr[0][0]).toBe("my-name");
		Expect(arr[0][1]).toBe("/**\n * Hi\n */\n");
	}

	@Test("should convert triple slash comments into JSdoc comments and strip initial spaces")
	public subScripts_triple_slash_spaces() {
		this.script.loadFromString("///      Hi");
		const arr = Array.from(this.script.subScripts());
		Expect(arr.length).toBe(1);
		Expect(arr[0][0]).toBe("my-name");
		Expect(arr[0][1]).toBe("/**\n * Hi\n */\n");
	}

	@Test("should NOT convert triple slash comments into JSdoc comments")
	public subScripts_not_four_slash() {
		this.script.loadFromString("//// Hi");
		const arr = Array.from(this.script.subScripts());
		Expect(arr.length).toBe(1);
		Expect(arr[0][0]).toBe("my-name");
		Expect(arr[0][1]).toBe("//// Hi");
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
