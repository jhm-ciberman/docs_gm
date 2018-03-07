import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";
import { Container } from "inversify";
import ScriptValidationRules from "../../../src/config/entities/ScriptValidationRules";
import RulesProvider from "../../../src/validation/RulesProvider";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RulesProvider")
export class RulesProviderFixture {

	@Test("RulesProvider")
	public RulesProvider() {
		const container = new Container();
		const rp = container.resolve(RulesProvider);

		Expect(rp.getRules().length).toBeGreaterThan(0);
		Expect(rp.getConfig(new ScriptValidationRules()).length).toBeGreaterThan(0);
	}
}
