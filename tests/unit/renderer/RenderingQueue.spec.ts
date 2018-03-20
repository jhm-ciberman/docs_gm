import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import DocScript from "../../../src/doc_models/DocScript";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RenderingQueueFixture")
export class RenderingQueueFixture {

	@Test()
	public RenderingQueue_cache() {
		const p = new DocProject("my project");
		const rq = new RenderingQueue(p);

		const el = new DocScript("my_script");

		const link1 = rq.linkTo(el);
		const link2 = rq.linkTo(el);

		Expect(link1).toBe("my_script.html");
		Expect(link2).toBe(link1);

		const next1 = rq.next() as DocResource;
		const next2 = rq.next() as DocResource;

		Expect(next1.name).toBe("my_script");
		Expect(next2).not.toBeDefined();
	}

	@Test()
	public RenderingQueue_index() {
		const p = new DocProject("my project");
		const rq = new RenderingQueue(p);
		Expect(rq.linkTo(p.root)).toBe("index.html");
	}

	@Test()
	public RenderingQueue_parents() {
		const p = new DocProject("my project");
		const rq = new RenderingQueue(p);
		const f = new DocFolder("my_folder");
		Expect(rq.linkTo(f)).toBe("my_folder.html");
		const el = new DocScript("my_script");
		el.parent = f;
		Expect(rq.linkTo(el)).toBe("my_folder/my_script.html");
		Expect(rq.linkTo(f)).toBe("my_folder.html");
	}
}
