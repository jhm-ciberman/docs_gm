import DocProject from "../doc_models/DocProject";
import DocResource from "../doc_models/DocResource";

/**
 * This class represents a Queue that stores the DocElement items to be rendered. It also generates
 * unique links for each
 */
export default class RenderingQueue {

	/**
	 * The queue
	 */
	private _queue: DocResource[] = [];

	/**
	 * A Map cache with the links
	 */
	private _linksMap: Map<DocResource, string> = new Map();

	/**
	 * The doc project that will be rendered
	 */
	private _project: DocProject;

	constructor(project: DocProject) {
		this._project = project;
	}

	/**
	 * Returns the relative path of the HTML file for the given IDocElement. Also,
	 * the element is added to the rendering queue if is not present.
	 * @param element The doc element
	 */
	public linkTo(element: DocResource) {
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
	public next(): DocResource | undefined {
		return this._queue.shift();
	}

	/**
	 * Returns a new unique url for a given element
	 * @param element The doc element
	 */
	private _createLinkTo(element: DocResource) {
		if (element === this._project.root) {
			return "index";
		} else {
			const p = element.fullpath;
			return (p.endsWith("/")) ? p.slice(0, -1) : p;
		}
	}

}
