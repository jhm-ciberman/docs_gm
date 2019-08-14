import DocResource from "../doc_models/DocResource";
import Page from "./Page";

/**
 * This class represents a Queue that stores the DocElement items to be rendered. It also generates
 * unique links for each
 */
export default class RenderingQueue {

	/**
	 * The queue
	 */
	private _queue: Page[] = [];

	private _resoucesMap: Map<DocResource, Page> = new Map();

	public findPage(resource: DocResource): Page | undefined {
		return this._resoucesMap.get(resource);
	}

	public addPage(page: Page) {
		if (this._resoucesMap.has(page.resource)) {
			return;
		}

		this._resoucesMap.set(page.resource, page);

		for (const res of page.subresources) {
			this._resoucesMap.set(res, page);
		}
		this._queue.push(page);
	}

	public get pages(): IterableIterator<Page> {
		return this._queue[Symbol.iterator]();
	}
}
