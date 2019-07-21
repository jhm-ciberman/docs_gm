import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import { IGetInstalledPath } from "../../../src/npmmodules";
import ModuleFinder from "../../../src/template/ModuleFinder";
import { TYPES } from "../../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ModuleFinder")
export class ModuleFinderFixture {

	@Test("ModuleFinder_find_Global")
	public async ModuleFinder_find_Global() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_Global);
		const mf = container.resolve(ModuleFinder);
		const result = await mf.find("foo");
		Expect(result).toBe("a");
	}

	@Test("ModuleFinder_find_Local")
	public async ModuleFinder_find_Local() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_Local);
		const mf = container.resolve(ModuleFinder);
		const result = await mf.find("bar");
		Expect(result).toBe("b");
	}

	@Test("ModuleFinder_find_NotFound")
	public async ModuleFinder_find_NotFound() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(this._mockGetInstalledPath_NotFound);
		const mf = container.resolve(ModuleFinder);

		return mf.find("bar").then(() => {
			throw new Error("load from not throw");
		}, (e: Error) => {
			Expect(e.message).toBe(`Cannot find the module "bar"`);
		});
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
