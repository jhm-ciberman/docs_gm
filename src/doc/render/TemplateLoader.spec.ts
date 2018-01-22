import {
	AsyncTest,
	Expect,
	SetupFixture,
	SpyOn,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { TempDir } from "../../_testing_helpers/TempDir.help";
import { myTemplateJSON } from "./__mock__/TemplateJSON.mock";
import Design from "./Design";
import TemplateLoader from "./TemplateLoader";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("Template (Static)")
export class TemplateStaticFixture {

	public template: TempDir;
	public invalid: TempDir;

	@SetupFixture
	public setupFixture() {
		this.template = TempDir.create("path/to/template", {
			"template.json": JSON.stringify(myTemplateJSON),
			"page.njk": "<h1>Hello world</h1>",
		});
		this.invalid = TempDir.create("path/to/invalid/template", {
			"template.json": "{invalid template object}",
		});
	}

	@TeardownFixture
	public teardownFixture() {
		TempDir.removeAll();
	}

	@AsyncTest("should load template from a file")
	public async loadFrom_valid() {
		const loader = new TemplateLoader();
		const template = await loader.loadFrom(this.template.dir);

		Expect(template.author).toBe("Darth Vader");
		Expect(template.web).toBe("http://foo.com/");
		Expect(template.description).toBe("My description");
		Expect(template.defaultDesign).toBeDefined();
		Expect((template.defaultDesign as Design).name).toBe("myDesign");
		Expect((template.defaultDesign as Design).displayName).toBe("My design");
		Expect(template.folder).toBe(this.template.dir);
	}

	@AsyncTest("should throw when loading an invalid template")
	public async loadFrom_invalid() {
		const loader = new TemplateLoader();
		loader.loadFrom(this.invalid.dir).then(() => {
			throw new Error("loadFrom() did not throw on invalid json");
		}).catch((e) => {
			Expect(e).toBeDefined();
		});
	}

	@AsyncTest("getTemplateModulePath for global install")
	public async getTemplateModulePath_global() {
		const loader = new TemplateLoader();
		loader.getInstalledPath = async (name: string, _opts?: GetInstalledPath.Options): Promise<string> => {
			if (name === "docs_gm-template-name") {
				return "a";
			}
			throw new Error("Invalid arguments to getInstalledPath");
		};
		Expect(await loader.getTemplateModulePath("template-name")).toBe("a");
	}

	@AsyncTest("getTemplateModulePath for local install")
	public async getTemplateModulePath_local() {
		const loader = new TemplateLoader();
		loader.getInstalledPath = async (name: string, _opts?: GetInstalledPath.Options): Promise<string> => {
			if (name === "docs_gm-template-name") {
				if (_opts && _opts.local) {
					return "a";
				}
				throw new Error("Fake error: module not exists");
			}
			throw new Error("Invalid arguments to getInstalledPath");
		};
		Expect(await loader.getTemplateModulePath("template-name")).toBe("a");
	}

	@AsyncTest("should throw when the template is not found")
	public async getTemplateModulePath_not_found() {
		const loader = new TemplateLoader();
		loader.getInstalledPath = async (_name: string, _opts?: GetInstalledPath.Options): Promise<string> => {
			throw new Error("Fake error: module not exists");
		};
		const spy = SpyOn(loader, "getInstalledPath");
		loader.getTemplateModulePath("template-name").then(() => {
			throw new Error("loadFrom() did not throw on invalid json");
		}).catch((e: Error) => {
			Expect(e).toBeDefined();
			Expect(e.message).not.toBe("Fake error: module not exists");
			// tslint:disable-next-line:no-unused-expression
			Expect(spy).toHaveBeenCalled().exactly(2).times;
		});
	}
}
