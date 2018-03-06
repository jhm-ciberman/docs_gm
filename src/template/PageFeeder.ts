import { injectable } from "inversify";
import DocFolder from "../doc_models/DocFolder";
import DocPage from "../doc_models/DocPage";
import DocProject from "../doc_models/DocProject";
import DocScript from "../doc_models/DocScript";
import IPageFeeder from "./interfaces/IPageFeeder";

/**
 * This class will generate an iterator with all the DocPages of the DocProject
 */
@injectable()
export default class PageFeeder implements IPageFeeder {
	/**
	 * Returns an iterator that generates one DocPage for each script
	 */
	public * oneScriptPerPage(docProject: DocProject): IterableIterator<DocPage> {
		const scripts = this._getAllScripts(docProject.scripts);
		for (const script of scripts) {
			const page = new DocPage(docProject);
			page.script = script;
			yield page;
		}
	}

	/**
	 * Returns an iterator that generates one single DocPage for all the scripts
	 */
	public * allTheScriptsInOnePage(docProject: DocProject): IterableIterator<DocPage> {
		const page = new DocPage(docProject);
		page.scripts = this._getAllScripts(docProject.scripts);
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
