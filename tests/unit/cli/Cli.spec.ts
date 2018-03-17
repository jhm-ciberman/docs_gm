import {
	AsyncTest,
	Expect,
	SpyOn,
	TestCase,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import Cli from "../../../src/cli/Cli";
import ICliGenerateFacade from "../../../src/cli/interfaces/ICliGenerateFacade";
import IReporter from "../../../src/reporter/interfaces/IReporter";
import { TYPES } from "../../../src/types";
import MockReporter from "../__mock__/MockReporter.mock";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockCliGGenerateFacade implements ICliGenerateFacade {
	public async init(): Promise<string> {
		throw new Error("Fake error init");
	}
	public async generate(_projectPath?: string | undefined, _opts: {[key: string]: any} = {}): Promise<void> {
		throw new Error("Fake error generate");
	}
}
@TestFixture("Cli")
export class CliFixture {

	@TestCase("generate", "generate path --noOpen", true)
	@TestCase("generate", "generate path --noOpen", false)
	@TestCase("init", "init", true)
	@TestCase("init", "init", false)
	@AsyncTest()
	public async cli(spyOnMethod: string, command: string, shouldFail: boolean) {
		const cliFacade = new MockCliGGenerateFacade();
		const spy = SpyOn(cliFacade, spyOnMethod);
		spy.andReturn(shouldFail
			? Promise.reject(new Error("Fake error"))
			: Promise.resolve(),
		);

		const reporter = new MockReporter();
		SpyOn(reporter, "info").andStub();

		const errorSpy = SpyOn(reporter, "error");
		errorSpy.andStub();

		const container = new Container();
		container.bind<IReporter>(TYPES.IReporter).toConstantValue(reporter);
		container.bind<ICliGenerateFacade>(TYPES.ICliGenerateFacade).toConstantValue(cliFacade);
		const cli = container.resolve(Cli);

		cli.parse(command.split(" "));

		// TODO: refactor cli.parse to return a promise
		return new Promise((resolve) => {
			setTimeout(() => {
				Expect(spy).toHaveBeenCalled();
				// Todo: this reporter.error() should be called. Why is not called?
				if (shouldFail) {
					Expect(errorSpy).toHaveBeenCalled();
				}
				resolve();
			}, 50);
		});

	}
}
