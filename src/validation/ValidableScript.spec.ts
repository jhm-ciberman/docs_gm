import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocScript from "../doc_models/DocScript";
import ValidableScript from "./ValidableScript";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ValidableScript")
export class ValidableScriptFixture {

	@Test("validableScript")
	public validableScript() {
		const docScript = new DocScript("foo");
		const validable = new ValidableScript(docScript, "return argument[0];");
		Expect(validable.argumentCount).toBe(1);
		Expect(validable.optionalArguments).toBe(true);
		Expect(validable.hasReturn).toBe(true);
		Expect(validable.doc).toBe(docScript);
	}
}
