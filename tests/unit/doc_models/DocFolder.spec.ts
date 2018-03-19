import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocScript from "../../../src/doc_models/DocScript";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocFolderFixture")
export class DocFolderFixture {

	@Test()
	public async DocFolder_all() {
		const folder1 = new DocFolder("my-folder1");
		folder1.children.push(new DocScript("foo"));
		folder1.children.push(new DocScript("bar"));

		const folder2 = new DocFolder("my-folder2");
		folder2.children.push(new DocScript("baz"));
		folder2.children.push(folder1);

		const arr = folder2.all;
		Expect(arr[0].name).toBe("baz");
		Expect(arr[1].name).toBe("foo");
		Expect(arr[2].name).toBe("bar");
	}

	@Test()
	public async DocFolder_fullpath() {
		const parent = new DocFolder("folder1");
		const child = new DocFolder("folder2");
		child.parent = parent;

		Expect(child.fullpath).toBe("folder2/folder1/");
	}

}
