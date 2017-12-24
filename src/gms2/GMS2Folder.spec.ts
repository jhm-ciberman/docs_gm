import GMS2Folder from "./GMS2Folder";

describe("GMS2Folder", () => {

	const folder = new GMS2Folder({
		// IResource
		id: "my-id",
		name: "my-name",
		// IFolder
		folderName: "my-folder-name",
		localisedFolderName: "ResourceTree_foo",
		children: [],
	});

	test("should get the folderName", () => {
		expect(folder.folderName).toBe("my-folder-name");
	});

	test("should get the topLevelname", () => {
		expect(folder.topLevelName).toBe("foo");
	});
});
