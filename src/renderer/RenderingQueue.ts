import IDocElement from "../doc_models/interfaces/IDocElement";
/**
 * This class represents a Queue that stores the DocElement items to be rendered. It also generates
 * unique links for each
 */
export default class RenderingQueue {

	/**
	 * The queue
	 */
	private _queue: IDocElement[] = [];

	/**
	 * A Map cache with the links
	 */
	private _linksMap: Map<IDocElement, string> = new Map();

	/**
	 * Returns the relative path of the HTML file for the given IDocElement. Also,
	 * the element is added to the rendering queue if is not present.
	 * @param element The doc element
	 */
	public linkTo(element: IDocElement) {
		let link = this._linksMap.get(element);
		if (!link) {
			link = this._createLinkTo(element);
			this._linksMap.set(element, link);
			this._queue.push(element);
		}
		return link + ".html";
	}

	/**
	 * Returns the next element on the rendering queue to be rendered.
	 */
	public next(): IDocElement | undefined {
		return this._queue.shift();
	}

	/**
	 * Returns a new unique url for a given element
	 * @param element The doc element
	 */
	private _createLinkTo(element: IDocElement) {
		const p = element.fullpath;
		if (p) {
			return (p.endsWith("/")) ? p.slice(0, -1) : p;
		} else {
			return "index";
		}
	}

}
