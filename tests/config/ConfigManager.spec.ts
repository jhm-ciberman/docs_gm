import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import container from "../../inversify.config";
import { TYPES } from "../../types";

import { TempDir } from "../_testing_helpers/TempDir.help";

import IConfigManager from "../../src/config/interfaces/IConfigManager";
import IProjectConfig from "../../src/config/interfaces/IProjectConfig";
import ProjectConfig from "../../src/config/ProjectConfig";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMScript")
export class GMS1ProjectFactoryFixture {

	public input: TempDir;
	public output: TempDir;

	public configManager: IConfigManager;

	@SetupFixture
	public setup() {
		const conf = new ProjectConfig();
		conf.output.template = "my_template_foo";
		this.input = TempDir.create("input", {
			"datafiles/docs_gm.json": JSON.stringify(conf),
			"invalid.json": "{invalidJSON}",
		});
		this.output = TempDir.create("output", {});
		this.configManager = container.get<IConfigManager>(TYPES.IConfigManager);
	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("exportConfig")
	public async exportConfig() {
		await this.configManager.exportConfig(this.output.dir);
		Expect(this.output.exists("docs_gm.json")).toBe(true);
	}

	@AsyncTest("exportConfig from dir")
	public async loadConfig_fromDir() {
		const conf = await this.configManager.loadConfig(this.input.dir);
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@AsyncTest("exportConfig from json")
	public async loadConfig_fromJson() {
		const conf = await this.configManager.loadConfig(this.input.join("datafiles/docs_gm.json"));
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@AsyncTest("exportConfig invalid json")
	public async loadConfig_invalid() {
		const conf = await this.configManager.loadConfig(this.input.join("invalid.json"));
		Expect(conf).not.toBeDefined();
	}
}
