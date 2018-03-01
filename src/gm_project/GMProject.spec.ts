import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMFolderMock from "./__mock__/GMFolder.mock";
import GMProject from "./GMProject";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMProject")
export class GMProjectFixture {

	public project: GMProject;

	@Setup
	public setup() {
		this.project = new GMProject("my-path/my-project/");
	}

	@Test("should get the name")
	public name() {
		Expect(this.project.name).toBe("my-project");
	}

	@Test("should get the path")
	public path() {
		Expect(this.project.path).toBe("my-path/my-project/");
	}

	@Test("children should return all the project top level folders")
	public children() {
		const folder1 = new GMFolderMock();
		this.project.addChild(folder1);
		const folder2 = new GMFolderMock();
		this.project.addChild(folder2);

		const arr = Array.from(this.project.children);
		Expect(arr.length).toBe(2);
		Expect(arr).toContain(folder1);
		Expect(arr).toContain(folder2);
	}

	@Test("The project fullpath is allways a '/' slash.")
	public fullpath() {
		Expect(this.project.fullpath).toBe("/");
	}
}
