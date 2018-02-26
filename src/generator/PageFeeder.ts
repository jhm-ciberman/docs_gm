import DocFolder from "../doc_models/DocFolder";
import DocPage from "../doc_models/DocPage";
import DocProject from "../doc_models/DocProject";
import DocScript from "../doc_models/DocScript";

/**
 * This class will generate an iterator with all the DocPages of the DocProject
 */
export default class PageFeeder {

	/**
	 * The docProject to generate the pages for
	 */
	private _docProject: DocProject;

	/**
	 * Creates an instance of PageFeeder.
	 * @param {DocProject} docProject The docProject to generate the pages for
	 */
	constructor(docProject: DocProject) {
		this._docProject = docProject;
	}

	/**
	 * Returns an iterator that generates one DocPage for each script
	 */
	public * oneScriptPerPage(): IterableIterator<DocPage> {
		const scripts = this._getAllScripts(this._docProject.scripts);
		for (const script of scripts) {
			const page = new DocPage();
			page.project = this._docProject;
			page.script = script;
			yield page;
		}
	}

	/**
	 * Returns an iterator that generates one single DocPage for all the scripts
	 */
	public * allTheScriptsInOnePage(): IterableIterator<DocPage> {
		const page = new DocPage();
		page.project = this._docProject;
		page.scripts = this._getAllScripts(this._docProject.scripts);
		yield page;
	}

	/**
	 * Returns recursively an array with all the scripts in a given folder.
	 */
	private _getAllScripts(folder: DocFolder): DocScript[] {
		let arr: DocScript[] = [];
		for (const res of folder.children) {
			if (res instanceof DocFolder) {
				arr = arr.concat(this._getAllScripts(res));
			} else if (res instanceof DocScript) {
				arr.push(res);
			}
		}
		return arr;
	}
}
