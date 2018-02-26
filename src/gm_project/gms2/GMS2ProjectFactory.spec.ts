import {
	AsyncTest,
	Expect,
	SetupFixture,
	TeardownFixture,
	TestFixture,
} from "alsatian";

import { TempDir } from "../../_testing_helpers/TempDir.help";
import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import * as ProjectBad from "./__mock__/ProjectBad.mock";
import * as ProjectEmpty from "./__mock__/ProjectEmpty.mock";
import * as ProjectFolderFolderRoom from "./__mock__/ProjectFolderFolderRoom.mock";
import * as ProjectFolderScript from "./__mock__/ProjectFolderScript.mock";
import * as ProjectSingleFolder from "./__mock__/ProjectSingleFolder.mock";
import GMS2ProjectFactory from "./GMS2ProjectFactory";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMScript")
export class GMS1ProjectFactoryFixture {

	public projectFolderScript: TempDir;

	public projectEmpty: TempDir;

	public projectSingleFolder: TempDir;

	public projectFolderFolderScript: TempDir;

	public projectBad: TempDir;

	@SetupFixture
	public setup() {
		this.projectEmpty = TempDir.create("my-project-empty", {
			"project.json": JSON.stringify(ProjectEmpty.project),
		});

		this.projectSingleFolder = TempDir.create("my-project-single-folder", {
			"project.json": JSON.stringify(ProjectSingleFolder.project),
			"my_folder.json": JSON.stringify(ProjectSingleFolder.folder),
		});

		this.projectFolderScript = TempDir.create("my-project-folder-script", {
			"project.json": JSON.stringify(ProjectFolderScript.project),
			"my_script.json": JSON.stringify(ProjectFolderScript.script),
			"my_folder.json": JSON.stringify(ProjectFolderScript.folder),
		});

		this.projectFolderFolderScript = TempDir.create("my-project-folder-folder-room", {
			"project.json": JSON.stringify(ProjectFolderFolderRoom.project),
			"my_room.json": JSON.stringify(ProjectFolderFolderRoom.room),
			"my_root_folder.json": JSON.stringify(ProjectFolderFolderRoom.rootFolder),
			"my_folder.json": JSON.stringify(ProjectFolderFolderRoom.folder),
		});

		this.projectBad = TempDir.create("my-project-bad", {
			"project.json": JSON.stringify(ProjectBad.project),
			"my_script.json": JSON.stringify(ProjectBad.script),
			"my_folder.json": JSON.stringify(ProjectBad.folder),
		});

	}

	@TeardownFixture
	public teardown() {
		TempDir.removeAll();
	}

	@AsyncTest("should load an empty project")
	public async load_empty() {
		const factory = new GMS2ProjectFactory(this.projectEmpty.join("project.json"));
		const proj: IGMProject = await factory.load();

		Expect(Array.from(proj.children).length).toBe(0);
		Expect(proj.path).toBe(this.projectEmpty.dir);
		Expect(proj.name).toBe("my-project-empty");
	}

	@AsyncTest("should load a single folder project")
	public async load_singleFolder() {
		const factory = new GMS2ProjectFactory(this.projectSingleFolder.join("project.json"));
		const proj: IGMProject = await factory.load();

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");
	}

	@AsyncTest("should load a folder/script project")
	public async load_folderScript() {
		const factory = new GMS2ProjectFactory(this.projectFolderScript.join("project.json"));
		const proj: IGMProject = await factory.load();

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");

		const children = Array.from(arr[0].children);
		Expect(children.length).toBe(1);
		Expect(children[0].name).toBe("my_script");
	}

	@AsyncTest("should load a folder/folder/room project")
	public async load_folder_folder_script() {
		const factory = new GMS2ProjectFactory(this.projectFolderFolderScript.join("project.json"));
		const proj: IGMProject = await factory.load();

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

	@AsyncTest("should load a project with bad keys references")
	public async load_bad() {
		const factory = new GMS2ProjectFactory(this.projectBad.join("project.json"));
		const proj: IGMProject = await factory.load();

		const arr = Array.from(proj.children);
		Expect(arr.length).toBe(1);
		Expect(arr[0].name).toBe("my_folder");

		const children = Array.from(arr[0].children);
		Expect(children.length).toBe(0);
	}

}
