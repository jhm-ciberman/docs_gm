import { DocElementType } from "../doc_models/enums/DocElementType";
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
	 * A cache with the links
	 */
	private _links: Map<IDocElement, string> = new Map();

	/**
	 * Returns the relative path of the HTML file for the given IDocElement. Also,
	 * the element is added to the rendering queue if is not present.
	 * @param element The doc element
	 */
	public linkTo(element: IDocElement) {
		let link = this._links.get(element);
		if (!link) {
			link = this._getLinkTo(element);
			this._links.set(element, link);
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
	private _getLinkTo(element: IDocElement) {
		if (element.type === DocElementType.Project) {
			return "index";
		} else {
			return element.name;
		}
	}

}
