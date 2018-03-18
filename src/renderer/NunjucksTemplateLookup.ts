import * as nunjucks from "nunjucks";
import { DocElementType } from "../doc_models/enums/DocElementType";
import Design from "../template/Design";

// TODO: remove this class (its useless since nunjucks already caches the files)
export default class NunjucksTemplateLookup {

	private _env: nunjucks.Environment;

	private _design: Design;

	private _templateCache: Map<string, nunjucks.Template> = new Map();

	constructor(design: Design) {
		this._design = design;
		this._env = nunjucks.configure(design.template.folder, {
			autoescape: false,
			throwOnUndefined: true,
		});
	}

	public get(elementType: DocElementType) {
		const inputFile = this._design.getInputFile(elementType);
		let temp = this._templateCache.get(inputFile);
		if (!temp) {
			temp = this._env.getTemplate(inputFile, true);
			this._templateCache.set(inputFile, temp);
		}
		return temp;
	}
}
