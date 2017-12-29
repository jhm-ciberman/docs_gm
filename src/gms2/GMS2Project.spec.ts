import * as mock from "mock-fs";

import { GMS2Folder } from "./GMS2Folder";
import GMS2Project from "./GMS2Project";
import GMS2Resource from "./GMS2Resource";
import { GMS2ResourceType } from "./GMS2ResourceType";
import { IFolder, IProject, IScript } from "./IGMS2Descriptor";

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

describe("GMS2Project", () => {
	let project: GMS2Project;
	beforeAll(() => {
		mock({
			"path/to/my-project/my-project.yyp": JSON.stringify(mockProject),
			"path/to/my-project/my-script/a.json": JSON.stringify(mockResourceScript),
			"path/to/my-project/my-folder/b.json": JSON.stringify(mockResourceFolder),
		});

		return GMS2Project.loadProject("path/to/my-project/my-project.yyp").then((p) => {
			project = p;
		});
	});

	afterAll(() => {
		mock.restore();
	});

	test("should load the project name", () => {
		expect(project.name).toBe("my-project");
	});

	test("should get the project path", () => {
		expect(project.path).toBe("path/to/my-project");
	});

	test("should load the script resource", () => {
		const script = project.getResourceByKey("my-script-key") as GMS2Resource;
		expect(script).toBeDefined();
		expect(script.id).toBe("my-script-id");
	});

	test("should load the folder resource", () => {
		const folder = project.getResourceByKey("my-folder-key") as GMS2Folder;
		expect(folder).toBeDefined();
		expect(folder.id).toBe("my-folder-id");
		expect(folder.children).toBeDefined();
		expect(folder.children.length).toBe(1);
		expect(folder.children[0].name).toBe("my-script-name");
	});
});
