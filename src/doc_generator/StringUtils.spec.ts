import StringUtils from "./StringUtils";

describe("StringUtils", () => {
	test("#escapeHtml should escape HTML correctly", () => {
		const str = StringUtils.escapeHtml("<b>Hello & Foo's \"World\"</b>");
		expect(str).toBe("&lt;b&gt;Hello &amp; Foo&#39;s &quot;World&quot;&lt;/b&gt;");
	});

	test("#stripInitialHypen should strip the initial hypen", () => {
		const str = StringUtils.stripInitialHypen("- Hello");
		expect(str).toBe("Hello");
	});

	test("#stripInitialLineFeeds should strip initial line feeds", () => {
		const str = StringUtils.stripInitialLineFeeds("\n\nHi\n");
		expect(str).toBe("Hi\n");
	});

	test("#compactHtmlSingleParagraph should remove <p> tags when there is a single paragraph", () => {
		const str1 = StringUtils.compactHtmlSingleParagraph("<p>Hi</p>");
		expect(str1).toBe("Hi");
		const str2 = StringUtils.compactHtmlSingleParagraph("<p>Foo</p><p>bar</p>");
		expect(str2).toBe("<p>Foo</p><p>bar</p>");
	});

	test("#markdown2Html should convert markdown to html", () => {
		const str = StringUtils.markdown2Html("# Hello");
		expect(str).toBe("<h1>Hello</h1>");
	});
});
