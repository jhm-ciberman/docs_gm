import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import { IGetInstalledPath } from "../../../src/npmmodules";
import ModuleFinder from "../../../src/template/ModuleFinder";
import ModuleFinderConfig from "../../../src/template/ModuleFinderConfig";
import { TYPES } from "../../../src/types";
import { TempDir } from "../../_testing_helpers/TempDir.help";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ModuleFinder")
export class ModuleFinderFixture {

	private _templatesDir: TempDir;

	@Setup
	public setup() {
		this._templatesDir = TempDir.create("folder/templates", {
			"bar/package.json": "{}",
		});
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("find_Global")
	public async find_Global() {
		const container = new Container();
		const f = async (name: string, opts: GetInstalledPath.Options | undefined) => {
			if (name === "foo" && opts === undefined) {
				return "a";
			} else {
				throw new Error("not found");
			}
		};
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(f);

		const mf = container.resolve(ModuleFinder);
		const result = await mf.find("foo", this._makeConfig());
		Expect(result).toBe("a");
	}

	@Test("find_Local")
	public async find_Local() {
		const container = new Container();
		const func = async (name: string, opts: GetInstalledPath.Options | undefined) => {
			if (name === "bar" && opts !== undefined && opts.cwd !== undefined && opts.local === true) {
				return "b";
			} else {
				throw new Error("not found");
			}
		};
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(func);
		const mf = container.resolve(ModuleFinder);

		const result = await mf.find("bar", this._makeConfig());
		Expect(result).toBe("b");
	}

	@Test("find_Local_Bundled")
	public async find_Local_Bundled() {
		const container = new Container();
		const func = async (_name: string, _opts: GetInstalledPath.Options | undefined) => {
			throw new Error("not found");
		};
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(func);
		const mf = container.resolve(ModuleFinder);

		const result = await mf.find("bar", this._makeConfig("", this._templatesDir.dir));
		Expect(result).toBe(this._templatesDir.resolve("bar"));
	}

	@Test("find_NotFound")
	public async find_NotFound() {
		const container = new Container();
		container.bind<IGetInstalledPath>(TYPES.IGetInstalledPath).toFunction(async (_name, _opts) => {
			throw new Error("not found");
		});
		const mf = container.resolve(ModuleFinder);

		return mf.find("bar", this._makeConfig()).then(() => {
			throw new Error("load from not throw");
		}, (e: Error) => {
			Expect(e.message).toBe(`Cannot find the module "bar"`);
		});
	}

	private _makeConfig(rootDir: string = "", templatesDir: string = "") {
		const config = new ModuleFinderConfig();
		config.packageRoot = rootDir;
		config.templatesPath = templatesDir;
		return config;
	}
}
