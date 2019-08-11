import DocProject from "../doc_models/DocProject";
import DocResource from "../doc_models/DocResource";
import IRenderingContext from "./IRenderingContext";

export default class Page {

	public readonly project: DocProject;

	public readonly resource: DocResource;

	private _subresources: DocResource[] = [];

	constructor(project: DocProject, element: DocResource) {
		this.project = project;
		this.resource = element;
	}

	public getContext(): IRenderingContext {
		return {
			project: this.project,
			element: this.resource,
		};
	}

	public get subresources() {
		return this._subresources;
	}

	public addSubresource(subresource: DocResource) {
		this._subresources.push(subresource);
	}

	/**
	 * Returns a new unique url for a given element
	 * @param element The doc element
	 */
	public getLink() {
		if (this.resource === this.project.root) {
			return "index";
		} else {
			const p = this.resource.fullpath;
			return (p.endsWith("/")) ? p.slice(0, -1) : p;
		}
	}
}
