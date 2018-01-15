import {
	AsyncSetupFixture,
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import * as xml2js from "xml2js";
import { TempDir } from "../_testing_helpers/TempDir.help";
import { IRoot } from "./GMS1Descriptor";
import GMS1Project from "./GMS1Project";

/* tslint:disable:max-classes-per-file completed-docs */

// Mock XML project
const mockProject: { assets: IRoot } = {
	assets: {
		scripts: [
			{
				$: {
					name: "scripts-root",
				},
				script: [
					"my-script-a",
					"my-script-b",
					"my-script-c",
				],
			},
		],
	},
};

@TestFixture("GMS1Project")
export class GMS1ProjectFixture {

	public project: GMS1Project;

	public tempDir: TempDir;

	@AsyncSetupFixture
	public async setupFixture() {
		const builder = new xml2js.Builder();
		this.tempDir = TempDir.create("path/to/my-project", {
			"my-project.xml": builder.buildObject(mockProject),
		});
		this.project = await GMS1Project.loadProject(this.tempDir.join("my-project.xml"));
		TempDir.removeAll();
	}

	@Test("should extract project name")
	public name() {
		Expect(this.project.name).toBe("my-project");
	}

	@Test("should get project path")
	public path() {
		Expect(this.project.path).toBe(this.tempDir.dir);
	}

}
