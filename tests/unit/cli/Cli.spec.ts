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
	public open: boolean = false;
	public design: string | undefined;
	public template: string | undefined;
	public outputFolder: string | undefined;
	public pattern: string | undefined;
	public async generate(_projectPath?: string | undefined): Promise<void> {
		return;
	}
}
@injectable()
class MockConfigManager implements IConfigManager {
	public exportConfig(_outputPath: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	public loadConfig(_jsonOrProjectPath: string): Promise<IProjectConfig | undefined> {
		throw new Error("Method not implemented.");
	}
}
@TestFixture("Cli")
export class CliFixture {
	@Test("should get the name")
	public name() {
		const cliFacade = new MockCliGGenerateFacade();
		const spyGenerate = SpyOn(cliFacade, "generate");

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).to(MockReporter);
		container.bind<IConfigManager>(TYPES.IConfigManager).to(MockConfigManager);
		container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).toConstantValue(cliFacade);
		const cli = container.resolve(Cli);
		cli.parse("node docs_gm generate path".split(" "));

		Expect(spyGenerate).toHaveBeenCalledWith("path");
	}
}
