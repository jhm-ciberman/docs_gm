import {
	Expect,
	SetupFixture,
	Test,
	TestFixture,
} from "alsatian";

import GMS1Folder from "./GMS1Folder";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMS1Folder")
export class GMS1FolderFixture {

	public folder: GMS1Folder;
	public child: GMS1Folder;

	@SetupFixture
	public setupFixture() {
		this.folder = new GMS1Folder("my-name", null);
		this.child = new GMS1Folder("my-name-child", this.folder);
		this.folder.children.push(this.child);
	}

	@Test("should get the name")
	public name() {
		Expect(this.folder.name).toBe("my-name");
	}

	@Test("should get the childrens")
	public children() {
		Expect(this.folder.children.length).toBe(1);
		Expect(this.folder.children[0]).toBe(this.child);
	}
}
