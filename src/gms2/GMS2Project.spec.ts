import {
	AsyncSetupFixture,
	Expect,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

import * as mock from "mock-fs";
import { GMS2Folder } from "./GMS2Folder";
import GMS2Project from "./GMS2Project";
import GMS2Resource from "./GMS2Resource";
import { GMS2ResourceType } from "./GMS2ResourceType";
import { IFolder, IProject, IScript } from "./IGMS2Descriptor";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS2Project")
export class GMS2ProjectFixture {
	public project: GMS2Project;

	@AsyncSetupFixture
	public async setupFixture() {
		const mockProject: IProject = {
			resources: [
				{
					Key: "my-script-key",
					Value: {
						id: "my-script-id",
						resourcePath: "my-script/a.json",
						resourceType: GMS2ResourceType.GMScript,
					},
				},
				{
					Key: "my-folder-key",
					Value: {
						id: "my-folder-id",
						resourcePath: "my-folder/b.json",
						resourceType: GMS2ResourceType.GMObject,
					},
				},
			],
		};

		const mockResourceScript: IScript = {
			modelName: GMS2ResourceType.GMScript,
			name: "my-script-name",
			id: "my-script-id",
		};

		const mockResourceFolder: IFolder = {
			modelName: GMS2ResourceType.GMFolder,
			name: "my-folder-name",
			folderName: "my-folder-name",
			localisedFolderName: "ResourceTree_Scripts",
			children: [
				"my-script-key",
			],
			id: "my-folder-id",
		};

		mock({
			"path/to/my-project/my-project.yyp": JSON.stringify(mockProject),
			"path/to/my-project/my-script/a.json": JSON.stringify(mockResourceScript),
			"path/to/my-project/my-folder/b.json": JSON.stringify(mockResourceFolder),
		});

		this.project = await GMS2Project.loadProject("path/to/my-project/my-project.yyp");
	}

	@TeardownFixture
	public teardownFixture() {
		mock.restore();
	}

	@Test("should load the project name")
	public name() {
		Expect(this.project.name).toBe("my-project");
	}

	@Test("should get the project path")
	public path() {
		Expect(this.project.path).toBe("path/to/my-project");
	}

	@Test("should load the script resource")
	public getResourceByKey_Script() {
		const script = this.project.getResourceByKey("my-script-key") as GMS2Resource;
		Expect(script).toBeDefined();
		Expect(script.id).toBe("my-script-id");
	}

	@Test("should load the folder resource")
	public getResourceByKey_Folder() {
		const folder = this.project.getResourceByKey("my-folder-key") as GMS2Folder;
		Expect(folder).toBeDefined();
		Expect(folder.id).toBe("my-folder-id");
		Expect(folder.children).toBeDefined();
		Expect(folder.children.length).toBe(1);
		Expect(folder.children[0].name).toBe("my-script-name");
	}
}