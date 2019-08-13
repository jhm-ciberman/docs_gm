import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import Page from "../../../src/renderer/Page";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

@TestFixture()
export class RenderingQueueFixture {

	@Test()
	public addPage() {
		const resource = new DocResource("foo", new DocProject("project"));
		const page = new Page(resource);
		const queue = new RenderingQueue();

		queue.addPage(page);
		Expect(queue.findPage(resource)).toBe(page);
		Expect(Array.from(queue.pages).length).toBe(1);

		queue.addPage(page); // calling it a second time should not add it again
		Expect(Array.from(queue.pages).length).toBe(1);
	}
}
