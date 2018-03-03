import { ITemplate } from "../interfaces/ITemplate";
import * as TemplateJSON from "../interfaces/TemplateJSON";
import Page from "./Page";

/**
 * Represents a single design of one Template
 */
export default class Design {

	/**
	 * The design display name
	 */
	public displayName: string | null;

	/**
	 * An array with the globs used when copying files from the input template folder to the
	 * output documentation folder.
	 */
	public copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

	/**
	 * The parent template
	 */
	public template: ITemplate;

	/**
	 * An array with the pages of the template
	 */
	private _pages: Page[] = [];

	/**
	 * Creates an instance of Design.
	 * @param {Template} template The parent template
	 * @memberof Design
	 */
	public constructor(template: ITemplate, data: TemplateJSON.IDesign) {
		this.template = template;
		this.displayName = data.displayName;
		if (data.copy) {
			this.copy = data.copy;
		}
		for (const page of data.pages) {
			this._pages.push(new Page(page.in, page.out, page.feedWith));
		}
	}

	/**
	 * An iterator with the pages
	 *
	 * @readonly
	 * @type {IterableIterator<Page>}
	 * @memberof Design
	 */
	get pages(): IterableIterator<Page> {
		return this._pages[Symbol.iterator]();
	}
}
