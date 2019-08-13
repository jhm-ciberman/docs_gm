import {
	Expect,
	Setup,
	Test,
	TestFixture,
} from "alsatian";

import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import LinkResolver from "../../../src/renderer/LinkResolver";
import Page from "../../../src/renderer/Page";
import RenderingQueue from "../../../src/renderer/RenderingQueue";

@TestFixture()
export class LinkResolverFixture {

	private _linkResolver: LinkResolver;

	private _page1: Page;
	private _page2: Page;
	private _pageNonInQueue: Page;

	@Setup
	public setUp() {
		const project = new DocProject("my project");
		project.root = new DocFolder("root", project);
		const res1 = new DocFolder("my_folder1", project);
		const res2 = new DocFolder("my_folder2", project);
		const res3 = new DocFolder("my_folder3", project);
		project.root.children = [res1, res2, res3];
		res1.parent = project.root;
		res2.parent = project.root;
		res3.parent = project.root;

		this._page1 = new Page(res1);
		this._page2 = new Page(res2);
		this._pageNonInQueue = new Page(res3);

		const queue = new RenderingQueue();
		queue.addPage(this._page1);
		queue.addPage(this._page2);

		this._linkResolver = new LinkResolver(queue, this._page1);
	}

	@Test()
	public linkTo() {
		Expect(this._linkResolver.linkTo(this._page2.resource)).toBe("my_folder2.html");
		Expect(this._linkResolver.linkTo(this._page1.resource)).toBe("my_folder1.html");
		Expect(() => this._linkResolver.linkTo(null as any)).toThrow();
		Expect(() => this._linkResolver.linkTo(this._pageNonInQueue.resource)).toThrow();
	}

	@Test()
	public asset() {
		Expect(this._linkResolver.asset("css/my_css.css")).toBe("../css/my_css.css");
	}
}
