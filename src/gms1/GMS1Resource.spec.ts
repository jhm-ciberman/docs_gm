import { IGMFolder, IGMResource } from "../IGMInterfaces";
import GMS1Resource from "./GMS1Resource";

/* tslint:disable:completed-docs */

class FolderMock implements IGMFolder {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public children: IGMResource[];
}

describe("GMS1Resource", () => {
	const resource = new GMS1Resource(null, "my-name");

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
