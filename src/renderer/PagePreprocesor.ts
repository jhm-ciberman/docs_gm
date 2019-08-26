import DocFolder from "../doc_models/DocFolder";
import DocResource from "../doc_models/DocResource";
import { DocResourceType } from "../doc_models/DocResourceType";
import DocScript from "../doc_models/DocScript";
import StringUtils from "../parser/StringUtils";
import LinkResolver from "./LinkResolver";
import Page from "./Page";

export default class PagePreprocesor {

	private static _regexInlineTags = /{@(.+?) (.+?)}/g;
	private static _regexLinkData = /(.+?)[\| ](.+)/;

	private _processedPages = new Set<Page>();

	private _linkResolver: LinkResolver;

	constructor(linkResolver: LinkResolver) {
		this._linkResolver = linkResolver;
	}

	public preprocessPage(page: Page) {
		if (this._processedPages.has(page)) {
			return;
		}

		if (page.type === DocResourceType.Script) {
			this._preprocessScript(page.resource as DocScript);
		} else if (page.type === DocResourceType.Folder) {
			const folder = page.resource as DocFolder;
			folder.description = this._replaceDesc(folder.description);
		}

		this._preprocessSubresources(page.subresources);

		this._processedPages.add(page);
	}

	private _preprocessSubresources(subresources: IterableIterator<DocResource>) {
		for (const script of subresources) {
			if (script.type === DocResourceType.Script) {
				this._preprocessScript(script as DocScript);
			}
		}
	}

	private _preprocessScript(script: DocScript) {
		if (script.description) {
			script.description = this._replaceDesc(script.description);
		}

		if (script.returns) {
			script.returns.description = this._replaceDesc(script.returns.description);
		}

		for (const param of script.params) {
			param.description = this._replaceDesc(param.description);
		}
	}

	private _replaceDesc(str: string) {
		const newStr = str.replace(PagePreprocesor._regexInlineTags,
			(_str: string, tagType: string, data: string) => this._inlineTagReplacer(tagType, data));

		return StringUtils.markdown2Html(newStr);
	}

	private _inlineTagReplacer(tagType: string, data: string): string {
		if (tagType === "link" || tagType === "linkplain" || tagType === "linkcode") {
			return this._generateLink(data, (tagType === "linkcode"));
		}

		throw new Error(`Unrecognized inline tag {@${tagType}}.`);
	}

	private _generateLink(data: string, isCode: boolean): string {
		let element = data;
		let text = data;
		const match = PagePreprocesor._regexLinkData.exec(data);
		if (match) {
			element = match[1];
			text = match[2];
		}

		if (isCode) {
			text = `<code>${text}</code>`;
		}

		const link = (element.includes("://")) ? element : this._linkResolver.linkTo(element);

		return `<a href="${link}">${text}</a>`;
	}
}
