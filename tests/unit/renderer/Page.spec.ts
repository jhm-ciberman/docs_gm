import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import Page from "../../../src/renderer/Page";

@TestFixture()
export class PageFixture {

	@Test()
	public shouldThrowIfTheResourceHasNoProject() {
		const res = new DocFolder("my_folder", undefined);
		Expect(() => new Page(res)).toThrow();
	}

	@Test()
	public hasSubresource() {
		const project = new DocProject("my project");
		const res = new DocFolder("my_folder", project);
		const subres = new DocFolder("my_folder2", project);

		const page = new Page(res);
		page.addSubresource(subres);
		Expect(page.hasSubresource(subres)).toBe(true);
	}

	@Test()
	public getLink() {
		const project = new DocProject("my project");
		const folder = new DocFolder("my_folder", project);
		const subfolder = new DocFolder("my_subfolder", project);
		subfolder.parent = folder;
		folder.children.push(subfolder);

		const page = new Page(subfolder);
		Expect(page.getLink()).toBe("my_folder/my_subfolder");
	}

	@Test()
	public getAnchor_ToAResourceThatIsASubResourceOfThePage() {
		const project = new DocProject("my project");
		const folder = new DocFolder("my_folder", project);
		const folder2 = new DocFolder("foo", project);

		const page = new Page(folder);
		page.addSubresource(folder2);
		Expect(page.getAnchor(folder2)).toBe("#foo");
	}

	@Test()
	public getAnchor_ToAResourceThatIsNotASubResourceOfThePage() {
		const project = new DocProject("my project");
		const folder = new DocFolder("my_folder", project);
		const folder2 = new DocFolder("foo", project);

		const page = new Page(folder);
		Expect(page.getAnchor(folder2)).toBe("");
	}

	@Test()
	public getRelativePathToPage_toSamePage() {
		const project = new DocProject("my project");
		const folder = new DocFolder("my_folder", project);

		const page = new Page(folder);
		Expect(page.getRelativePathToPage(page)).toBe("my_folder.html");
	}
}
