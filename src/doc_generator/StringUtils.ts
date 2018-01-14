import * as showdown from "showdown";
/**
 * Static class with util functions to parse and proces strings
 */
export default class StringUtils {

	/**
	 * Escapes the passed HTML string
	 * @param str The string
	 * @return The output string
	 */
	public static escapeHtml(str: string): string {
		// Source: https://github.com/mozilla/nunjucks/blob/f1edabf48fc9acae38972cb19497b1072e901965/src/lib.js
		const escapeMap: any = {
			"&": "&amp;",
			'"': "&quot;",
			"'": "&#39;",
			"<": "&lt;",
			">": "&gt;",
		};
		return str.replace(/[&"'<>]/g, (ch: string) => {
			return escapeMap[ch] as string;
		});
	}

	/**
	 * Strips the initial hypen
	 * Example: "- Hello" turns into "Hello"
	 * @param str The string
	 * @return The output string
	 */
	public static stripInitialHypen(str: string): string {
		return str.replace(/^- /, "");
	}

	/**
	 * Strips the initial Line Feeds
	 * Example: "\n\nHi\n" turns into "Hi\n"
	 * @param str The string
	 * @return The output string
	 */
	public static stripInitialLineFeeds(str: string): string {
		return str.replace(/^\n*/, "");
	}

	/**
	 * Removes the <p> elements in single paragraphs.
	 * Example:
	 * "<p>Hi</p>" is turned in "Hi"
	 * But "<p>Foo</p><p>bar</p>" is preserved as is.
	 * @param str The string
	 * @return The output string
	 */
	public static compactHtmlSingleParagraph(str: string): string {
		const m = /<p>([\s\S]*?)<\/p>/g.exec(str);
		return (m && m[0] === m.input) ? m[1] : str;
	}

	/**
	 * Converts the passed markup text to HTML
	 * @param markupText The Markup Text to convert
	 * @return The HTML string
	 */
	public static markdown2Html(markupText: string): string {
		// Lazy init showdown converter class
		this._markdown = this._markdown || new showdown.Converter({
			simplifiedAutoLink: true,
			literalMidWordUnderscores: true,
			literalMidWordAsterisks: true,
			tables: true,
			openLinksInNewWindow: true,
			omitExtraWLInCodeBlocks: true,
			noHeaderId: true,
		} as showdown.ConverterOptions);

		return this._markdown.makeHtml(markupText);
	}

	/**
	 * Markdown converter (lazy initialized)
	 */
	private static _markdown: showdown.Converter | undefined;

}
