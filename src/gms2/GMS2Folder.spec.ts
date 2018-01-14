import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import { IGMFolder, IGMResource } from "../IGMInterfaces";
import { GMS2Folder } from "./GMS2Folder";
import IGetResourceByKey from "./IGetResourceByKey";

/* tslint:disable:max-classes-per-file completed-docs */

class MockGMResource implements IGMResource {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
}

const mockFolder = new GMS2Folder({
	id: "my-mock-id",
	name: "my-mock-name",
	folderName: "my-mock-folder-name",
	localisedFolderName: "ResourceTree_foo",
	children: ["x", "y"],
});

class MockProject implements IGetResourceByKey {
	public getResourceByKey(key: string): IGMResource | undefined {
		if (key === "folder") {
			return mockFolder;
		} else if (key === "non-existent") {
			return undefined;
		} else {
			const inst = new MockGMResource();
			inst.name = key;
			return inst;
		}
	}
}

@TestFixture("GMS2Folder")
export class GMS2FolderFixture {

	public folder = new GMS2Folder({
		// IResource
		id: "my-id",
		name: "my-name",
		// IFolder
		folderName: "my-folder-name",
		localisedFolderName: "ResourceTree_foo",
		children: ["a", "b", "c", "folder", "non-existent"],
	});

	@Test("should get the folder name")
	public name() {
		Expect(this.folder.name).toBe("my-folder-name");
	}

	@Test("should get the topLevelname")
	public topLevelName() {
		Expect(this.folder.topLevelName).toBe("foo");
	}

	@Test("should get the fullpath")
	public fullpath() {
		Expect(this.folder.fullpath).toBe("my-folder-name/");
	}

	@Test("should be able to build a subtree")
	public buildSubtree() {
		this.folder.buildSubtree(new MockProject());

		Expect(this.folder.children.length).toBe(4);
		Expect(this.folder.children[0].name).toBe("a");
		Expect(this.folder.children[1].name).toBe("b");
		Expect(this.folder.children[2].name).toBe("c");

		const subfolder: GMS2Folder = this.folder.children[3] as GMS2Folder;
		Expect(subfolder.name).toBe("my-mock-folder-name");
		Expect(subfolder.children.length).toBe(2);
		Expect(subfolder.children[0].name).toBe("x");
		Expect(subfolder.children[1].name).toBe("y");
	}
}
