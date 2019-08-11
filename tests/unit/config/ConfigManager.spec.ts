import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { TempDir } from "../../_testing_helpers/TempDir.help";

import { Container } from "inversify";
import ConfigManager from "../../../src/config/ConfigManager";
import IConfigManager from "../../../src/config/IConfigManager";
import { IProjectConfig } from "../../../src/config/IProjectConfig";
import { ProjectConfig } from "../../../src/config/ProjectConfig";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMScript")
export class GMS1ProjectFactoryFixture {

	public input: TempDir;
	public output: TempDir;

	public configManager: IConfigManager;

	@Setup
	public setup() {
		const conf = new ProjectConfig();
		conf.output.template = "my_template_foo";
		this.input = TempDir.create("input", {
			"datafiles/docs_gm.json": JSON.stringify(conf),
			"invalid.json": "{invalidJSON}",
		});
		this.output = TempDir.create("output", {});
		const container = new Container();
		this.configManager = container.resolve(ConfigManager);
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("exportConfig")
	public async exportConfig() {
		await this.configManager.exportConfig(this.output.dir);
		Expect(this.output.exists("docs_gm.json")).toBe(true);
	}

	@Test("exportConfig from dir")
	public async loadConfig_fromDir() {
		const conf = await this.configManager.loadConfig(this.input.dir);
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@Test("exportConfig from json")
	public async loadConfig_fromJson() {
		const conf = await this.configManager.loadConfig(this.input.join("datafiles/docs_gm.json"));
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@Test("exportConfig invalid json")
	public async loadConfig_invalid() {
		const conf = await this.configManager.loadConfig(this.input.join("invalid.json"));
		Expect(conf).not.toBeDefined();
	}
}
