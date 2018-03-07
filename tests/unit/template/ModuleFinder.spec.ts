import {
	AsyncTest,
	Expect,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import { IGetInstalledPath } from "../../../src/npmmodules";
import ModuleFinder from "../../../src/template/ModuleFinder";
import { TYPES } from "../../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ModuleFinder")
export class ModuleFinderFixture {

	@AsyncTest("ModuleFinder_find_Global")
	public async ModuleFinder_find_Global() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_Global);
		const mf = container.resolve(ModuleFinder);
		const result = await mf.find("foo");
		Expect(result).toBe("a");
	}

	@AsyncTest("ModuleFinder_find_Local")
	public async ModuleFinder_find_Local() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_Local);
		const mf = container.resolve(ModuleFinder);
		const result = await mf.find("bar");
		Expect(result).toBe("b");
	}

	@AsyncTest("ModuleFinder_find_NotFound")
	public async ModuleFinder_find_NotFound() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_NotFound);
		const mf = container.resolve(ModuleFinder);
		Expect(async () => await mf.find("bar")).toThrowAsync();
	}

	private async _mockGetInstalledPath_Global(
		name: string,
		opts: GetInstalledPath.Options | undefined,
	): Promise<string> {
		if (name === "foo" && opts === undefined) {
			return "a";
		} else {
			throw new Error("not found");
		}
	}

	private async _mockGetInstalledPath_Local(
		name: string,
		opts: GetInstalledPath.Options | undefined,
	): Promise<string> {
		if (name === "bar" && opts !== undefined && opts.cwd !== undefined && opts.local === true) {
			return "b";
		} else {
			throw new Error("not found");
		}
	}

	private async _mockGetInstalledPath_NotFound(
		_name: string,
		_opts: GetInstalledPath.Options | undefined,
	): Promise<string> {
		throw new Error("not found");
	}
}
