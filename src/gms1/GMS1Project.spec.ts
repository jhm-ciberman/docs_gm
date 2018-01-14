import {
	AsyncSetupFixture,
	Expect,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

import * as mock from "mock-fs";
import * as xml2js from "xml2js";
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

	@AsyncSetupFixture
	public async setupFixture() {
		const b = new xml2js.Builder();
		mock({
			"path/to/my-project/my-project.xml": b.buildObject(mockProject),
		});
		this.project = await GMS1Project.loadProject("path/to/my-project/my-project.xml");
	}

	@TeardownFixture
	public teardownFixture() {
		mock.restore();
	}

	@Test("should extract project name")
	public name() {
		Expect(this.project.name).toBe("my-project");
	}

	@Test("should get project path")
	public path() {
		Expect(this.project.path).toBe("path/to/my-project");
	}

}