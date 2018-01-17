import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import ProjectLoader from "./ProjectLoader";
/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocsGM")
export class DocsGMFixture {

	@Test("Test")
	public test() {
		Expect(ProjectLoader).toBe(ProjectLoader);
	}
}
