import DocFolder from "../doc_models/DocFolder";
import DocResource from "../doc_models/DocResource";
import { DocResourceType } from "../doc_models/DocResourceType";
import DocScript from "../doc_models/DocScript";
import Page from "./Page";
import RenderingQueue from "./RenderingQueue";

export interface IRenderingQueueBuilderOptions {scriptPages: boolean; folderPages: boolean; }

export default class RenderingQueueBuilder {

	private _config: IRenderingQueueBuilderOptions;

	private _pages: Page[] = [];

	constructor(rootFolder: DocFolder, config: IRenderingQueueBuilderOptions) {
		this._config = config;

		if (!config.folderPages && rootFolder.project) {
			const project = rootFolder.project;
			project.root.children = this._flattenFolder(project.root, project.root);
			project.root.parent = null;
		}

		const page = this._newPage(rootFolder);

		for (const resource of rootFolder.children) {
			this._addResource(page, resource);
		}
	}

	public build(): RenderingQueue {
		const queue = new RenderingQueue();
		for (const page of this._pages) {
			queue.addPage(page);
		}
		return queue;
	}

	private _addResource(currentPage: Page, resource: DocResource) {
		switch (resource.type) {
			case DocResourceType.Folder:
			this._addFolder(currentPage, resource as DocFolder);

			return;
			case DocResourceType.Script:
			this._addScript(currentPage, resource as DocScript);
			return;
		}
	}

	private _addFolder(currentPage: Page, folder: DocFolder): Page {
		if (this._config.folderPages) {
			currentPage = this._newPage(folder);
		}

		for (const resource of folder.children) {
			this._addResource(currentPage, resource);
		}
		return currentPage;
	}

	private _newPage(resource: DocResource) {
		const page = new Page(resource);
		this._pages.push(page);
		return page;
	}

	private _addScript(currentPage: Page, script: DocScript) {
		if (this._config.scriptPages) {
			this._newPage(script);
		} else {
			currentPage.addSubresource(script);
		}
	}

	private _flattenFolder(newParent: DocFolder, folder: DocFolder): DocResource[] {
		return folder.children.reduce<DocResource[]>((arr, child) => {
			child.parent = newParent;
			if (child.type === DocResourceType.Folder) {
				return arr.concat(this._flattenFolder(newParent, child as DocFolder));
			} else {
				return [...arr, child];
			}
		}, []);
	}
}
