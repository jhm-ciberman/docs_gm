import {
	Expect, Test, TestCase, TestFixture,
} from "alsatian";

import { Container } from "inversify";
import ConfigOverrider from "../../../src/config/ConfigOverrider";
import { ProjectConfig } from "../../../src/config/ProjectConfig";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ConfigOverriderFixture")
export class ConfigOverriderFixture {

	@TestCase("pattern")
	@TestCase("root")
	@Test()
	public async override_base(key: string) {
		const confOverrider = (new Container()).resolve(ConfigOverrider);
		const out = confOverrider.override(new ProjectConfig(), { [key]: "foo"});
		Expect((out as any)[key]).toBe("foo");
	}

	@TestCase("template")
	@TestCase("outputFolder")
	@TestCase("scriptPages")
	@TestCase("folderPages")
	@Test()
	public async override_output(key: string) {
		const confOverrider = (new Container()).resolve(ConfigOverrider);
		const out = confOverrider.override(new ProjectConfig(), { [key]: "foo" });
		Expect((out.output as any)[key]).toBe("foo");
	}

}
