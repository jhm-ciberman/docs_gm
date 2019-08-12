import * as path from "path";
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

	constructor(resource: DocResource) {
		if (!resource.project) {
			throw new Error("The resource has no project property");
		}
		this.project = resource.project;
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
		const name = this.fullpath;
		return (name.endsWith("/")) ? name.slice(0, -1) : name;
	}

	public get fullpath() {
		if (this.isRoot) {
			return "index";
		}
		return this.resource.fullpath;
	}

	public get name() {
		if (this.isRoot) {
			return "index";
		}
		return this.resource.name;
	}

	public getFilename() {
		return this.getLink() + ".html";
	}

	public getAnchor(element: DocResource) {
		if (element === this.resource || this.hasSubresource(element)) {
			return "";
		}
		return element.type !== "folder" ? "#" + element.name : "";
	}

	public getRelativePath(page: Page) {
		if (page === this) {
			return this.name + ".html";
		}
		const dir = path.dirname(this.getFilename());
		return path.relative(dir, page.getFilename()).replace("\\", "/");
	}
}
