import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import GMS2Script from "../../../../src/gm_project/gms2/GMS2Script";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS2Script")
export class GMS2ScriptFixture {

	@Test("should load a script and get the script content and name through an iterator")
	public subScripts() {
		const script = new GMS2Script("my-name", false);
		const arr = Array.from(script.subScripts("my-gml-content"));
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my-name");
		Expect(arr[0].text).toBe("my-gml-content");
	}

	@Test("should convert triple slash comments into JSdoc comments")
	public subScripts_triple_slash() {
		const script = new GMS2Script("my-name", false);
		const arr = Array.from(script.subScripts("/// Hi"));
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my-name");
		Expect(arr[0].text).toBe("/**\n * Hi\n */\n");
	}

	@Test("should convert triple slash comments into JSdoc comments and strip initial spaces")
	public subScripts_triple_slash_spaces() {
		const script = new GMS2Script("my-name", false);
		const arr = Array.from(script.subScripts("///      Hi"));
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my-name");
		Expect(arr[0].text).toBe("/**\n * Hi\n */\n");
	}

	@Test("should NOT convert triple slash comments into JSdoc comments")
	public subScripts_not_four_slash() {
		const script = new GMS2Script("my-name", false);
		const arr = Array.from(script.subScripts("//// Hi"));
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my-name");
		Expect(arr[0].text).toBe("//// Hi");
	}

	@Test("should get the filepath of the gml file of a non-compatibility script")
	public filepath_NonCompatibility() {
		const script = new GMS2Script("my-name", false);
		Expect(script.filepath).toBe("scripts/my-name/my-name.gml");
	}

	@Test("should get the filepath of the gml file of a compatibility script")
	public filepath_Compatibility() {
		const script = new GMS2Script("my-name", true);
		Expect(script.filepath).toBe("scripts/@my-name/my-name.gml");
	}

}
