import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import StringUtils from "../src/StringUtils";

/* tslint:disable:max-classes-per-file completed-docs */
@TestFixture("StringUtils")
export class StringUtilsFixture {
	@Test("#escapeHtml should escape HTML correctly")
	public escapeHtml() {
		const str = StringUtils.escapeHtml("<b>Hello & Foo's \"World\"</b>");
		Expect(str).toBe("&lt;b&gt;Hello &amp; Foo&#39;s &quot;World&quot;&lt;/b&gt;");
	}

	@Test("#stripInitialHypen should strip the initial hypen")
	public stripInitialHypen() {
		const str = StringUtils.stripInitialHypen("- Hello");
		Expect(str).toBe("Hello");

	}

	@Test("#stripInitialLineFeeds should strip initial line feeds")
	public stripInitialLineFeeds() {
		const str = StringUtils.stripInitialLineFeeds("\n\nHi\n");
		Expect(str).toBe("Hi\n");

	}

	@Test("#compactHtmlSingleParagraph should remove <p> tags when there is a single paragraph")
	public compactHtmlSingleParagraphSingle() {
		const str1 = StringUtils.compactHtmlSingleParagraph("<p>Hi</p>");
		Expect(str1).toBe("Hi");

	}

	@Test("#compactHtmlSingleParagraph should not remove <p> tags when there are multiple paragraph")
	public compactHtmlSingleParagraphMulti() {
		const str2 = StringUtils.compactHtmlSingleParagraph("<p>Foo</p><p>bar</p>");
		Expect(str2).toBe("<p>Foo</p><p>bar</p>");
	}

	@Test("#markdown2Html should convert markdown to html")
	public markdown2Html() {
		const str = StringUtils.markdown2Html("# Hello");
		Expect(str).toBe("<h1>Hello</h1>");
	}
}
