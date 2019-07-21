import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestFixture,
} from "alsatian";
import { TempDir } from "../../../_testing_helpers/TempDir.help";

import IGMFolder from "../../../../src/gm_project/interfaces/IGMFolder";
import IGMProject from "../../../../src/gm_project/interfaces/IGMProject";

import GMS2ProjectLoader from "../../../../src/gm_project/gms2/GMS2ProjectLoader";
import projectBad from "./__mock__/ProjectBad.mock";
import projectEmpty from "./__mock__/ProjectEmpty.mock";
import projectFolderFolderRoom from "./__mock__/ProjectFolderFolderRoom.mock";
import projectFolderScript from "./__mock__/ProjectFolderScript.mock";
import projectSingleFolder from "./__mock__/ProjectSingleFolder.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS2ProjectLoader")
export class GMS2ProjectLoaderFixture {

	public projectFolderScript: TempDir;

	public projectEmpty: TempDir;

	public projectSingleFolder: TempDir;

	public projectFolderFolderScript: TempDir;

	public projectBad: TempDir;

	@Setup
	public setup() {
		this.projectEmpty = TempDir.create("my-project-empty", {
			"project.json": JSON.stringify(projectEmpty.project),
		});

		this.projectSingleFolder = TempDir.create("my-project-single-folder", {
			"project.json": JSON.stringify(projectSingleFolder.project),
			"my_folder.json": JSON.stringify(projectSingleFolder.folder),
		});

		this.projectFolderScript = TempDir.create("my-project-folder-script", {
			"project.json": JSON.stringify(projectFolderScript.project),
			"my_script.json": JSON.stringify(projectFolderScript.script),
			"my_folder.json": JSON.stringify(projectFolderScript.folder),
		});

		this.projectFolderFolderScript = TempDir.create("my-project-folder-folder-room", {
			"project.json": JSON.stringify(projectFolderFolderRoom.project),
			"my_room.json": JSON.stringify(projectFolderFolderRoom.room),
			"my_root_folder.json": JSON.stringify(projectFolderFolderRoom.rootFolder),
			"my_folder.json": JSON.stringify(projectFolderFolderRoom.folder),
		});

		this.projectBad = TempDir.create("my-project-bad", {
			"project.json": JSON.stringify(projectBad.project),
			"my_script.json": JSON.stringify(projectBad.script),
			"my_folder.json": JSON.stringify(projectBad.folder),
		});

	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@Test("should load an empty project")
	public async load_empty() {
		const factory = new GMS2ProjectLoader();
		const proj: IGMProject = await factory.load(this.projectEmpty.join("project.json"));

		Expect(Array.from(proj.children).length).toBe(0);
		Expect(proj.path).toBe(this.projectEmpty.dir);
		Expect(proj.name).toBe("my-project-empty");
	}

	@Test("should load a single folder project")
	public async load_singleFolder() {
		const factory = new GMS2ProjectLoader();
		const proj: IGMProject = await factory.load(this.projectSingleFolder.join("project.json"));

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");
	}

	@Test("should load a folder/script project")
	public async load_folderScript() {
		const factory = new GMS2ProjectLoader();
		const proj: IGMProject = await factory.load(this.projectFolderScript.join("project.json"));

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");

		const children = Array.from(arr[0].children);
		Expect(children.length).toBe(1);
		Expect(children[0].name).toBe("my_script");
	}

	@Test("should load a folder/folder/room project")
	public async load_folder_folder_script() {
		const factory = new GMS2ProjectLoader();
		const proj: IGMProject = await factory.load(this.projectFolderFolderScript.join("project.json"));

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_root_folder");

		const children = Array.from(arr[0].children);
		Expect(children.length).toBe(1);
		Expect(children[0].name).toBe("my_folder");
		Expect(children[0].name).toBe("my_folder");

		const subchildren = Array.from((children[0] as IGMFolder).children);
		Expect(subchildren.length).toBe(1);
		Expect(subchildren[0].name).toBe("my_room");
	}

	@Test("should load a project with bad keys references")
	public async load_bad() {
		const factory = new GMS2ProjectLoader();
		const proj: IGMProject = await factory.load(this.projectBad.join("project.json"));

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");

		const children = Array.from(arr[0].children);
		Expect(children.length).toBe(0);
	}

}
