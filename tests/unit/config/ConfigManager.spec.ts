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
import SchemaValidator from "../../../src/SchemaValidator";
import { TYPES } from "../../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture()
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
		container.bind(TYPES.ISchemaValidator).to(SchemaValidator);
		this.configManager = container.resolve(ConfigManager);
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test()
	public async exportConfig() {
		await this.configManager.exportConfig(this.output.dir);
		Expect(this.output.exists("docs_gm.json")).toBe(true);
	}

	@Test()
	public async loadConfig_fromDir() {
		const conf = await this.configManager.loadConfig(this.input.dir);
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@Test()
	public async loadConfig_fromJson() {
		const conf = await this.configManager.loadConfig(this.input.join("datafiles/docs_gm.json"));
		Expect(conf).toBeDefined();
		Expect((conf as IProjectConfig).output.template).toBe("my_template_foo");
	}

	@Test()
	public async loadConfig_invalid() {
		Expect(() => this.configManager.loadConfig(this.input.join("invalid.json"))).toThrowAsync();
	}
}
