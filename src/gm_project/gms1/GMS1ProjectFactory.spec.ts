import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import * as xml2js from "xml2js";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import IGMProject from "../interfaces/IGMProject";
import GMS1ProjectFactory from "./GMS1ProjectFactory";
import { IGMS1DescriptorRoot } from "./IGMS1Descriptor";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMScript")
export class GMS1ProjectFactoryFixture {

	public folder: TempDir;

	@SetupFixture
	public setup() {
		const projectNormal: IGMS1DescriptorRoot = {
			assets: {
				scripts: [{
					$: { name: "scripts"},
					script: ["my_script_1", "my_script_2"],
					scripts: [{
						$: { name: "subfolder" },
						script: ["my_script_3"],
					}, {
						$: { name: "emptyfolder" },
					}],
				}],
			},
		};

		const projectEmpty: IGMS1DescriptorRoot = {
			assets: {},
		};

		const builder = new xml2js.Builder();
		this.folder = TempDir.create("folder", {
			"my-project-normal.xml": builder.buildObject(projectNormal),
			"my-project-empty.xml": builder.buildObject(projectEmpty),
			"my-project-invalid.xml": "<invalid_xml>",
		});

	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("should load a normal project")
	public async load_normal() {
		const factory = new GMS1ProjectFactory(this.folder.join("my-project-normal.xml"));
		const proj: IGMProject = await factory.load();

		const leafs = proj.getSubtreeLeafs();
		Expect(leafs.length).toBe(3);
	}

	@AsyncTest("should load an empty project")
	public async load_empty() {
		const factory = new GMS1ProjectFactory(this.folder.join("my-project-empty.xml"));
		const proj: IGMProject = await factory.load();

		const leafs = proj.getSubtreeLeafs();
		Expect(leafs.length).toBe(0);
	}

	@AsyncTest("should thrown on invalid XML project")
	public async load_invalid() {
		const factory = new GMS1ProjectFactory(this.folder.join("my-project-invalid.xml"));
		return factory.load().then(() => {
			throw new Error("load() did not throw on invalid xml");
		}).catch((e) => {
			Expect(e).toBeDefined();
		});
	}

}
