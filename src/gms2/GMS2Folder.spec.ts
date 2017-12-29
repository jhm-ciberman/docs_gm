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

describe("GMS2Folder", () => {

	const folder = new GMS2Folder({
		// IResource
		id: "my-id",
		name: "my-name",
		// IFolder
		folderName: "my-folder-name",
		localisedFolderName: "ResourceTree_foo",
		children: ["a", "b", "c", "folder", "non-existent"],
	});

	test("should get the folder name", () => {
		expect(folder.name).toBe("my-folder-name");
	});

	test("should get the topLevelname", () => {
		expect(folder.topLevelName).toBe("foo");
	});

	test("should get the fullpath", () => {
		expect(folder.fullpath).toBe("my-folder-name/");
	});

	test("should be able to build a subtree", () => {
		folder.buildSubtree(new MockProject());

		expect(folder.children.length).toBe(4);
		expect(folder.children[0].name).toBe("a");
		expect(folder.children[1].name).toBe("b");
		expect(folder.children[2].name).toBe("c");

		const subfolder: GMS2Folder = folder.children[3] as GMS2Folder;
		expect(subfolder.name).toBe("my-mock-folder-name");
		expect(subfolder.children.length).toBe(2);
		expect(subfolder.children[0].name).toBe("x");
		expect(subfolder.children[1].name).toBe("y");
	});
});
