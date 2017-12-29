import GMS1Folder from "./GMS1Folder";

describe("GMS1Folder", () => {
	const folder = new GMS1Folder("my-name", null);
	const child = new GMS1Folder("my-name-child", folder);
	folder.children.push(child);

	test("should get the name", () => {
		expect(folder.name).toBe("my-name");
	});
	test("should get the childrens", () => {
		expect(folder.children.length).toBe(1);
		expect(folder.children[0]).toBe(child);
	});
});
