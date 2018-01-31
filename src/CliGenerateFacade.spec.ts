import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import CliGenerateFacade from "./CliGenerateFacade";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("CliGenerateFacade")
export class CliGenerateFacadeFixture {

	public cli: CliGenerateFacade;

	@Setup
	public setup() {
		this.cli = new CliGenerateFacade();
	}

	@Test("should get the name")
	public name() {
		Expect(this.cli).toBe(this.cli);
	}
}
