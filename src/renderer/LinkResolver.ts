import RenderingQueue from "./RenderingQueue";

import Page from "./Page";

import DocResource from "../doc_models/DocResource";

export default class LinkResolver {

	private _queue: RenderingQueue;

	private _currentPage: Page;

	constructor(queue: RenderingQueue, currentPage: Page) {
		this._queue = queue;
		this._currentPage = currentPage;
	}

	public linkTo(element: DocResource): string {
		if (!element) {
			throw new Error("Invalid Element passed to linkTo(docElement) function: " + element);
		}
		const newPage = this._findPage(element);

		return this._currentPage.getRelativePathToPage(newPage) + newPage.getAnchor(element);
	}

	public asset(assetName: string): string {
		return this._currentPage.getRelativePath(assetName);
	}

	private _findPage(element: DocResource) {
		const page = this._queue.findPage(element);
		if (!page) {
			throw new Error(`Trying to get page for element  "${element.name}" that is not in the project.`);
		}
		return page;
	}
}
