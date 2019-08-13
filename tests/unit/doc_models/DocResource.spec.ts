import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocResource from "../../../src/doc_models/DocResource";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocResourceFixture")
export class DocResourceFixture {

	@Test()
	public fullpath_nested() {
		const parent = new DocFolder("folder1");
		const child = new DocResource("res");
		child.parent = parent;

		Expect(child.fullpath).toBe("folder1/res");
	}

	@Test()
	public fullpath_root() {
		const child = new DocResource("res");
		Expect(child.fullpath).toBe("res");
	}

	@Test()
	public anchor() {
		const resource = new DocResource("res");
		Expect(resource.anchor).toBe("res");
	}

	@Test()
	public next() {
		const parent = new DocFolder("folder1");

		const resource = new DocResource("resA");
		resource.parent = parent;

		const nextResource = new DocResource("resB");
		nextResource.parent = parent;

		parent.children = [resource, nextResource];

		Expect(resource.next).toBe(nextResource);
	}

	@Test()
	public next_withoutParent() {
		const resource = new DocResource("resA");
		Expect(resource.next).toBe(null);
	}

	@Test()
	public next_withParent_withoutParentChildren() {
		const resource = new DocResource("resA");
		resource.parent = new DocFolder("folder1");
		Expect(resource.next).toBe(null);
	}

	@Test()
	public prev() {
		const parent = new DocFolder("folder1");

		const resource = new DocResource("resA");
		resource.parent = parent;

		const prevResource = new DocResource("resB");
		prevResource.parent = parent;

		parent.children = [prevResource, resource];

		Expect(resource.prev).toBe(prevResource);
	}

	@Test()
	public prev_withoutParent() {
		const resource = new DocResource("resA");
		Expect(resource.prev).toBe(null);
	}

	@Test()
	public prev_withParent_withoutParentChildren() {
		const resource = new DocResource("resA");
		resource.parent = new DocFolder("folder1");
		Expect(resource.prev).toBe(null);
	}
}
