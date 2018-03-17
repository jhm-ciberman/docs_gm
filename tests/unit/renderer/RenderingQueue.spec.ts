import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocProject from "../../../src/doc_models/DocProject";
import DocScript from "../../../src/doc_models/DocScript";
import IDocElement from "../../../src/doc_models/interfaces/IDocElement";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("RenderingQueueFixture")
export class RenderingQueueFixture {

	@Test()
	public test_cache() {
		const rq = new RenderingQueue();
		const el = new DocScript("my_script");
		const link1 = rq.linkTo(el);
		const link2 = rq.linkTo(el);
		const next1 = rq.next() as IDocElement;
		const next2 = rq.next() as IDocElement;
		Expect(link1).toBe("my_script.html");
		Expect(link2).toBe(link1);
		Expect(next1.name).toBe("my_script");
		Expect(next2).not.toBeDefined();
	}

	@Test()
	public test_project_index() {
		const rq = new RenderingQueue();
		const p = new DocProject("my project");
		const link = rq.linkTo(p);
		Expect(link).toBe("index.html");
	}
}
