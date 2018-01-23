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

	@Test("find should find resources by glob")
	public find() {
		const folder1 = new GMFolderMock();
		folder1.fullpath = "folder1";
		this.project.addChild(folder1);

		const folder2 = new GMFolderMock();
		folder2.fullpath = "folder2";
		this.project.addChild(folder2);

		const folder3 = new GMFolderMock();
		folder3.fullpath = "not-this";
		this.project.addChild(folder3);

		const arr = this.project.find("**/folder*");
		Expect(arr.length).toBe(2);
		Expect(arr).toContain(folder1);
		Expect(arr).toContain(folder2);
	}
}
