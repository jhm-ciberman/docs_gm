import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";
import GMProject from "../../../src/gm_project/GMProject";
import MockGMFolder from "../__mock__/MockGMFolder.mock";

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
		const folder1 = new MockGMFolder("foo", []);
		this.project.addChild(folder1);
		const folder2 = new MockGMFolder("bar", []);
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
