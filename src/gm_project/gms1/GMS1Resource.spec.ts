import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import IGMFolder from "../interfaces/IGMFolder";
import IGMResource from "../interfaces/IGMResource";
import GMS1Resource from "./GMS1Resource";

/* tslint:disable:completed-docs max-classes-per-file */

class FolderMock implements IGMFolder {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public children: IGMResource[];
}

@TestFixture("GMS1Resource")
export class GMS1ResourceFixture {
	public resource = new GMS1Resource(null, "my-name");

	@Test("should get the name")
	public name() {
		Expect(this.resource.name).toBe("my-name");
	}

	@Test("should get the fullpath when it has no parent")
	public fullpath() {
		Expect(this.resource.fullpath).toBe("my-name");
	}

	@Test("should get the fullpath when it has parent")
	public fullpath_HasParent() {
		const folder = new FolderMock();
		folder.fullpath = "my-fullpath/";
		this.resource.parent = folder;
		Expect(this.resource.fullpath).toBe("my-fullpath/my-name");
	}
}
