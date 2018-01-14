import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocsGM from "./DocsGM";
/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocsGM")
export class DocsGMFixture {

	@Test("Test")
	public test() {
		Expect(DocsGM).toBe(DocsGM);
	}
}
