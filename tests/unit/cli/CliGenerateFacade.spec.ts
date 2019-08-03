import {
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import { ChildProcess } from "child_process";
import { Container, injectable } from "inversify";
import CliGenerateFacade from "../../../src/cli/CliGenerateFacade";
import IConfigManager from "../../../src/config/IConfigManager";
import IConfigOverrider from "../../../src/config/IConfigOverrider";
import IProjectConfig from "../../../src/config/IProjectConfig";
import ProjectConfig from "../../../src/config/ProjectConfig";
import IDocumentationGenerator from "../../../src/generator/IDocumentationGenerator";
import IGMProject from "../../../src/gm_project/IGMProject";
import IGMProjectLoader from "../../../src/gm_project/IGMProjectLoader";
import { IOpen } from "../../../src/npmmodules";
import IReporter from "../../../src/reporter/IReporter";
import { TYPES } from "../../../src/types";
import MockGMProject from "../__mock__/MockGMProject.mock";
import MockReporter from "../__mock__/MockReporter.mock";

/* tslint:disable:max-classes-per-file completed-docs */

const config = new ProjectConfig();
const project = new MockGMProject("project", []);

@injectable()
class MockGMProjectLoader implements IGMProjectLoader {
	public async load(_file: string): Promise<IGMProject> {
		return project;
	}
}
@injectable()
class MockConfigManager implements IConfigManager {
	public async exportConfig(_outputPath: string): Promise<string> {
		return "foo";
	}
	public async loadConfig(jsonOrProjectPath: string): Promise<IProjectConfig | undefined> {
		return jsonOrProjectPath === "." ? config : undefined;
	}
}
@injectable()
class MockDocumentationGenerator implements IDocumentationGenerator {
	public async generate(p: IGMProject, c?: IProjectConfig | undefined): Promise<string> {
		if (project === p && config === c) {
			return "my_output_folder/";
		}
		return "";
	}
}
@injectable()
class MockConfigOverrider implements IConfigOverrider {
	public override(conf: IProjectConfig, _overrideConfig: { [key: string]: string; }): IProjectConfig {
		return conf;
	}
}
@TestFixture("CliGenerateFacade")
export class CliGenerateFacadeFixture {

	@Test()
	public async generate_default() {
		return this._getCgf().generate();
	}

	@Test()
	public async generate_noDefaultConfig() {
		return this._getCgf().generate("other/path/with/no/config");
	}

	@Test()
	public async generate_noOpen() {
		return this._getCgf().generate("other/path/with/no/config", {noOpen: true});
	}

	@Test()
	public async generate_init() {
		return this._getCgf().init();
	}

	private _getCgf(): CliGenerateFacade {
		const container = new Container();
		const reporter = new MockReporter();
		SpyOn(reporter, "info").andStub();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);
		container.bind<IGMProjectLoader>(TYPES.IGMProjectLoader).to(MockGMProjectLoader);
		container.bind<IConfigManager>(TYPES.IConfigManager).to(MockConfigManager);
		container.bind<IDocumentationGenerator>(TYPES.IDocumentationGenerator).to(MockDocumentationGenerator);
		container.bind<IConfigOverrider>(TYPES.IConfigOverrider).to(MockConfigOverrider);
		container.bind<IOpen>(TYPES.IOpen).toFunction((target) => this._mockOpen(target));
		return container.resolve(CliGenerateFacade);
	}

	private _mockOpen(target: string): Promise<ChildProcess> {
		if (!target.includes("my_output_folder") && !target.includes("index.html")) {
			throw new Error("Invalid target: " + target);
		}
		return null as unknown as Promise<ChildProcess>;
	}
}
