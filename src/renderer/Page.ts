import DocFolder from "../doc_models/DocFolder";
import DocProject from "../doc_models/DocProject";
import DocResource from "../doc_models/DocResource";
import { DocResourceType } from "../doc_models/DocResourceType";
import DocScript from "../doc_models/DocScript";
import IRenderingContext from "./IRenderingContext";

export default class Page {

	public readonly project: DocProject;

	public readonly resource: DocResource;

	private _subresources: Set<DocResource> = new Set();

	constructor(project: DocProject, resource: DocResource) {
		this.project = project;
		this.resource = resource;
	}

	public getContext(): IRenderingContext {
		return {
			project: this.project,
			resource: this.resource,
			script: (this.resource.type === DocResourceType.Script) ? this.resource as DocScript : undefined,
			folder: (this.resource.type === DocResourceType.Folder) ? this.resource as DocFolder : undefined,
			subresources: this.subresources,
		};
	}

	public get subresources(): IterableIterator<DocResource> {
		return this._subresources.values();
	}

	public addSubresource(subresource: DocResource) {
		this._subresources.add(subresource);
	}

	public hasSubresource(subresource: DocResource): boolean {
		return this._subresources.has(subresource);
	}

	public get isRoot(): boolean {
		return (this.resource === this.project.root);
	}

	/**
	 * Returns a new unique url for a given element
	 * @param element The doc element
	 */
	public getLink() {
		if (this.isRoot) {
			return "index";
		}
		const p = this.resource.fullpath;
		return (p.endsWith("/")) ? p.slice(0, -1) : p;
	}

	public getFilename() {
		return this.getLink() + ".html";
	}

	public getAnchorLinkToSubresource(element: DocResource) {
		if (this.hasSubresource(element)) {
			// tslint:disable-next-line:max-line-length
			throw new Error("Cannot generate an anchor link to a subresource that is not meant be shown on the page. Resource: " + element.name);
		}
		const anchor = element.type !== "folder" ? "#" + element.name : "";
		return this.getFilename() + anchor;
	}
}
