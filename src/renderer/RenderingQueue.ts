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

	private _resoucesToPagesMap: Map<DocResource, Page> = new Map();
	private _resoucesNamesMap: Map<string, DocResource> = new Map();

	public findPage(resource: DocResource): Page | undefined {
		return this._resoucesToPagesMap.get(resource);
	}

	public findResourceByName(name: string): DocResource | undefined {
		return this._resoucesNamesMap.get(name);
	}

	public addPage(page: Page) {
		if (this._resoucesToPagesMap.has(page.resource)) {
			return;
		}

		this._addResource(page.resource, page);

		for (const res of page.subresources) {
			this._addResource(res, page);
		}
		this._queue.push(page);
	}

	private _addResource(resource: DocResource, page: Page) {
		this._resoucesToPagesMap.set(resource, page);
		this._resoucesNamesMap.set(resource.name, resource);
	}

	public get pages(): IterableIterator<Page> {
		return this._queue[Symbol.iterator]();
	}
}
