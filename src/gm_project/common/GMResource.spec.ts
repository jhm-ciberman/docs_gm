import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import GMFolderMock from "./__mock__/GMFolder.mock";
import GMResource from "./GMResource";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("GMResource")
export class GMResourceFixture {

	public resource: GMResource;

	@Setup
	public setup() {
		this.resource = new GMResource("my-name");
	}

	@Test("should get the name")
	public name() {
		Expect(this.resource.name).toBe("my-name");
	}

	@Test("should get the fullpath when it has no parent")
	public fullpath_NoParent() {
		Expect(this.resource.fullpath).toBe("my-name");
	}

	@Test("should get the fullpath when it has parent")
	public fullpath_Parent() {
		const folder = new GMFolderMock();
		folder.fullpath = "my-fullpath/";
		this.resource.parent = folder;
		Expect(this.resource.fullpath).toBe("my-fullpath/my-name");
	}

	@Test("match should match the fullpath against a glob")
	public match() {
		const folder = new GMFolderMock();
		folder.fullpath = "/my-fullpath/a/b/c/";
		this.resource.parent = folder;
		Expect(this.resource.match("**/c/my-name")).toBe(true);
	}
}
