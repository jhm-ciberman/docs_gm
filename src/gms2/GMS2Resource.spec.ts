import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { IGMFolder, IGMResource } from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";

/* tslint:disable:max-classes-per-file completed-docs */

class FolderMock implements IGMFolder {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public children: IGMResource[];
}

@TestFixture("GMS2Resource")
export class GMS2ResourceFixture {

	public resource = new GMS2Resource({
		// IResource
		id: "my-id",
		name: "my-name",
	});

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
		const folder = new FolderMock();
		folder.fullpath = "my-fullpath/";
		this.resource.parent = folder;
		Expect(this.resource.fullpath).toBe("my-fullpath/my-name");
	}
}
