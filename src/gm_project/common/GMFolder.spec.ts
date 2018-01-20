import {
	Expect,
	SetupFixture,
	Test,
	TestFixture,
} from "alsatian";

import GMFolder from "./GMFolder";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMFolder")
export class GMFolderFixture {

	public folder: GMFolder;

	@SetupFixture
	public setupFixture() {
		this.folder = new GMFolder("my-name");

	}

	@Test("should get the name")
	public name() {
		Expect(this.folder.name).toBe("my-name");
	}

	@Test("should get the childrens")
	public children() {
		const child = new GMFolder("my-name-child");
		this.folder.addChild(child);

		const arr = Array.from(this.folder.children);
		Expect(arr.length).toBe(1);
		Expect(arr).toContain(child);
	}
}
