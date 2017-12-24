import GMS2Resource from "../gms2/GMS2Resource";
import { IGMFolder, IGMResource } from "../IGMInterfaces";

class FolderMock implements IGMFolder {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public children: IGMResource[];
}

describe("GMS2Resource", () => {

	const resource = new GMS2Resource({
		// IResource
		id: "my-id",
		name: "my-name",
	});

	test("should get the name", () => {
		expect(resource.name).toBe("my-name");
	});

	test("should get the fullpath when it has no parent", () => {
		expect(resource.fullpath).toBe("my-name");
	});

	test("should get the fullpath when it has parent", () => {
		const folder = new FolderMock();
		folder.fullpath = "my-fullpath/";
		resource.parent = folder;
		expect(resource.fullpath).toBe("my-fullpath/my-name");
	});
});
