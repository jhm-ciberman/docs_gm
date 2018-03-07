import {
	AsyncTest,
	SpyOn,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import CliGenerateFacade from "../../../src/cli/CliGenerateFacade";
import ProjectConfig from "../../../src/config/entities/ProjectConfig";
import IConfigManager from "../../../src/config/interfaces/IConfigManager";
import IProjectConfig from "../../../src/config/interfaces/IProjectConfig";
import IDocumentationGenerator from "../../../src/generator/interfaces/IDocumentationGenerator";
import IGMProject from "../../../src/gm_project/interfaces/IGMProject";
import IGMProjectLoader from "../../../src/gm_project/interfaces/IGMProjectLoader";
import { IOpen } from "../../../src/npmmodules";
import IReporter from "../../../src/reporter/interfaces/IReporter";
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
		throw new Error("Method not implemented.");
	}
	public async loadConfig(_jsonOrProjectPath: string): Promise<IProjectConfig | undefined> {
		return config;
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
@TestFixture("CliGenerateFacade")
export class CliGenerateFacadeFixture {

	@AsyncTest("generate")
	public async generate() {
		const container = new Container();
		const reporter = new MockReporter();
		SpyOn(reporter, "info").andStub();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);
		container.bind<IGMProjectLoader>(TYPES.IGMProjectLoader).to(MockGMProjectLoader);
		container.bind<IConfigManager>(TYPES.IConfigManager).to(MockConfigManager);
		container.bind<IDocumentationGenerator>(TYPES.IDocumentationGenerator).to(MockDocumentationGenerator);
		container.bind<IOpen>(TYPES.IOpen).toFunction((target) => this._mockOpen(target));
		const cgf = container.resolve(CliGenerateFacade);
		await cgf.generate();
	}

	private _mockOpen(target: string) {
		if (!target.includes("my_output_folder") || !target.includes("index.html")) {
			throw new Error("Invalid target: " + target);
		}
	}
}
