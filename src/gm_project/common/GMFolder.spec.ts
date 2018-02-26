import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMScriptMock from "./__mock__/GMScript.mock";
import GMFolder from "./GMFolder";

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

	@Test("should get the name")
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
		const a = new GMScriptMock("my_script");
		this.folder.addChild(a);

		const b = new GMScriptMock("FOLDER_foo");
		this.folder.addChild(b);

		const c = new GMScriptMock("my_other_script");
		this.folder.addChild(c);

		Expect(this.folder.moduleScript).toBe(b);
	}

	@Test("moduleScript should return null if no script child is named FOLDER_ or MODULE_")
	public moduleScript_notFound() {
		const a = new GMScriptMock("my_script");
		this.folder.addChild(a);

		Expect(this.folder.moduleScript).toBeNull();
	}
}
