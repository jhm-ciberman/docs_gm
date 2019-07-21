import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";

import * as xml2js from "xml2js";
import { IGMS1DescriptorRoot } from "../../../src/gm_project/gms1/IGMS1Descriptor";
import { TempDir } from "../../_testing_helpers/TempDir.help";

import GMProjectLoader from "../../../src/gm_project/GMProjectLoader";
import GMS2ProjectEmpty from "./gms2/__mock__/ProjectEmpty.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocsGM")
export class DocsGMFixture {

	public projectGMS1: TempDir;

	public projectGMS2: TempDir;

	public noProject: TempDir;

	@Setup
	public setup() {
		const projectEmpty: IGMS1DescriptorRoot = {
			assets: {},
		};
		const builder = new xml2js.Builder();
		this.projectGMS1 = TempDir.create("project-GMS1", {
			"project.gmx": builder.buildObject(projectEmpty),
		});
		this.projectGMS2 = TempDir.create("project-GMS2", {
			"project.yyp": JSON.stringify(GMS2ProjectEmpty.project),
		});
		this.noProject = TempDir.create("project-Invalid", {});
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("load should load a GMS1 Project")
	public async load_GMS1() {
		const loader = new GMProjectLoader();
		const p = await loader.load(this.projectGMS1.dir);
		Expect(p).toBeDefined();
	}

	@Test("load should load a GMS2 Project")
	public async load_GMS2() {
		const loader = new GMProjectLoader();
		const p = await loader.load(this.projectGMS2.dir);
		Expect(p).toBeDefined();
	}

	@Test("load should thrown when loading an invalid project")
	public async load_Invalid() {
		const loader = new GMProjectLoader();
		return await loader.load(this.noProject.dir).then(() => {
			throw new Error("load() did not throw on invalid project");
		}).catch((e) => {
			Expect(e).toBeDefined();
		});
	}
}
