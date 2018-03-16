import {
	Expect,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import Cli from "../../../src/cli/Cli";
import ICliGenerateFacade from "../../../src/cli/interfaces/ICliGenerateFacade";
import IConfigManager from "../../../src/config/interfaces/IConfigManager";
import IProjectConfig from "../../../src/config/interfaces/IProjectConfig";
import IReporter from "../../../src/reporter/interfaces/IReporter";
import { TYPES } from "../../../src/types";
import MockReporter from "../__mock__/MockReporter.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockCliGGenerateFacade implements ICliGenerateFacade {
	public async generate(_projectPath?: string | undefined, _opts: {[key: string]: any} = {}): Promise<void> {
		// void
	}
}
@injectable()
class MockConfigManager implements IConfigManager {
	public exportConfig(_outputPath: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	public async loadConfig(_jsonOrProjectPath: string): Promise<IProjectConfig | undefined> {
		return undefined;
	}
}
@TestFixture("Cli")
export class CliFixture {
	@Test()
	public cli_test() {
		const cliFacade = new MockCliGGenerateFacade();
		const spyGenerate = SpyOn(cliFacade, "generate");

		const reporter = new MockReporter();
		SpyOn(reporter, "info").andStub();

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);
		container.bind<IConfigManager>(TYPES.IConfigManager).to(MockConfigManager);
		container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).toConstantValue(cliFacade);
		const cli = container.resolve(Cli);
		cli.parse("generate path --noOpen".split(" "));

		Expect(spyGenerate).toHaveBeenCalled();
	}
}
