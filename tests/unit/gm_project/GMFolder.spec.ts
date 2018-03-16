import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";
import GMFolder from "../../../src/gm_project/GMFolder";
import MockGMScript from "../__mock__/MockGMScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMFolder")
export class GMFolderFixture {

	public folder: GMFolder;

	public child: GMFolder;

	@Setup
	public setup() {
		this.folder = new GMFolder("my-name");
		this.child = new GMFolder("my-name-child");
		this.folder.addChild(this.child);
	}

	@Test()
	public name() {
		Expect(this.folder.name).toBe("my-name");
	}

	@Test("should get the children")
	public children() {
		const arr = Array.from(this.folder.children);
		Expect(arr.length).toBe(1);
		Expect(arr).toContain(this.child);
	}

	@Test("should get the fullpath")
	public fullpath() {
		Expect(this.folder.fullpath).toBe("my-name/");
		Expect(this.child.fullpath).toBe("my-name/my-name-child/");
	}

	@Test("moduleScript should return the first direct script child named FOLDER_ or MODULE_")
	public moduleScript_found() {
		const a = new MockGMScript("my_script");
		this.folder.addChild(a);

		const b = new MockGMScript("FOLDER_foo");
		this.folder.addChild(b);

		const c = new MockGMScript("my_other_script");
		this.folder.addChild(c);

		Expect(this.folder.moduleScript).toBe(b);
	}

	@Test("moduleScript should return null if no script child is named FOLDER_ or MODULE_")
	public moduleScript_notFound() {
		const a = new MockGMScript("my_script");
		this.folder.addChild(a);

		Expect(this.folder.moduleScript).toBeNull();
	}
}
