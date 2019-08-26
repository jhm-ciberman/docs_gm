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

	public linkTo(element: DocResource | string): string {
		const resource = (typeof element === "string") ? this._queue.findResourceByName(element) : element;

		if (!resource) {
			throw new Error("Invalid Element passed to linkTo(docElement) function: " + element);
		}

		const newPage = this._findPage(resource);

		return this._currentPage.getRelativePathToPage(newPage) + newPage.getAnchor(resource);
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
