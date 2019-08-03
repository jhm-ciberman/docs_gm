import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import * as xml2js from "xml2js";
import GMFolder from "../../../../src/gm_project/GMFolder";
import GMProject from "../../../../src/gm_project/GMProject";
import GMS1ProjectLoader from "../../../../src/gm_project/gms1/GMS1ProjectLoader";
import { IGMS1DescriptorRoot } from "../../../../src/gm_project/gms1/IGMS1Descriptor";
import IGMProject from "../../../../src/gm_project/IGMProject";
import { TempDir } from "../../../_testing_helpers/TempDir.help";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS1ProjectLoader")
export class GMS1ProjectLoaderFixture {

	public folder: TempDir;

	@Setup
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

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("should load a normal project")
	public async load_normal() {
		const factory = new GMS1ProjectLoader();
		const proj: IGMProject = await factory.load(this.folder.join("my-project-normal.xml"));

		const ls = this._ls(proj as GMProject);
		Expect(ls).toEqual([
			"/",
			"/scripts/",
			"/scripts/subfolder/",
			"/scripts/subfolder/my_script_3",
			"/scripts/emptyfolder/",
			"/scripts/my_script_1",
			"/scripts/my_script_2",
		]);
	}

	@Test("should load an empty project")
	public async load_empty() {
		const loader = new GMS1ProjectLoader();
		const proj: IGMProject = await loader.load(this.folder.join("my-project-empty.xml"));

		const ls = this._ls(proj as GMProject);
		Expect(ls).toEqual([
			"/",
		]);
	}

	@Test("should thrown on invalid XML project")
	public async load_invalid() {
		const loader = new GMS1ProjectLoader();
		return loader.load(this.folder.join("my-project-invalid.xml")).then(() => {
			throw new Error("load() did not throw on invalid xml");
		}).catch((e) => {
			Expect(e).toBeDefined();
		});
	}

	private _ls(f: GMFolder): string[] {
		let arr: string[] = [f.fullpath];
		for (const res of f.children) {
			if (res instanceof GMFolder) {
				arr = arr.concat(this._ls(res));
			} else {
				arr.push(res.fullpath);
			}
		}
		return arr;
	}

}
