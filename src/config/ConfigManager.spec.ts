import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { TempDir } from "../_testing_helpers/TempDir.help";
import ConfigManager from "./ConfigManager";
import IProjectConfig from "./interfaces/IProjectConfig";
import ProjectConfig from "./models/ProjectConfig";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMScript")
export class GMS1ProjectFactoryFixture {

	public input: TempDir;
	public output: TempDir;

	@SetupFixture
	public setup() {
		const conf = new ProjectConfig();
		conf.output.template = "my_template_foo";
		this.input = TempDir.create("input", {
			"datafiles/docs_gm.json": JSON.stringify(conf),
			"invalid.json": "{invalidJSON}",
		});
		this.output = TempDir.create("output", {});
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("exportConfig")
	public async exportConfig() {
		const configManager = new ConfigManager();
		await configManager.exportConfig(this.output.dir);
		Expect(this.output.exists("docs_gm.json")).toBe(true);
	}

	@AsyncTest("exportConfig from dir")
	public async loadConfig_fromDir() {
		const configManager = new ConfigManager();
		const conf = await configManager.loadConfig(this.input.dir);
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@AsyncTest("exportConfig from json")
	public async loadConfig_fromJson() {
		const configManager = new ConfigManager();
		const conf = await configManager.loadConfig(this.input.join("datafiles/docs_gm.json"));
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@AsyncTest("exportConfig invalid json")
	public async loadConfig_invalid() {
		const configManager = new ConfigManager();
		const conf = await configManager.loadConfig(this.input.join("invalid.json"));
		Expect(conf).not.toBeDefined();
	}
}
