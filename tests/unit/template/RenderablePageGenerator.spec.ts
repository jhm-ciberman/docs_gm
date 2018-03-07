import {
	AsyncTest,
	Expect,
	TestCase,
	TestFixture,
} from "alsatian";

import { Container, injectable } from "inversify";
import DocPage from "../../../src/doc_models/DocPage";
import DocProject from "../../../src/doc_models/DocProject";
import Page from "../../../src/template/entities/Page";
import { PageFeedWith } from "../../../src/template/enums/PageFeedWith";
import IPageFeeder from "../../../src/template/interfaces/IPageFeeder";
import RenderablePageGenerator from "../../../src/template/RenderablePageGenerator";
import { TYPES } from "../../../src/types";

/* tslint:disable:max-classes-per-file completed-docs */
@injectable()
class MockPageFeeder implements IPageFeeder {
	public oneFolderPerPage(_docProject: DocProject): IterableIterator<DocPage> {
		throw new Error("Method not implemented.");
	}
	public * oneScriptPerPage(_docProject: DocProject): IterableIterator<DocPage> {
		yield new DocPage(new DocProject("SUPER_PROJECT_1"));
	}
	public * allTheScriptsInOnePage(_docProject: DocProject): IterableIterator<DocPage> {
		yield new DocPage(new DocProject("SUPER_PROJECT_2"));
	}
}

@TestFixture("RenderablePageGenerator")
export class RenderablePageGeneratorFixture {

	@TestCase(PageFeedWith.Script, "SUPER_PROJECT_1")
	@TestCase(PageFeedWith.Scripts, "SUPER_PROJECT_2")
	@AsyncTest("RenderablePageGenerator_getPages")
	public async RenderablePageGenerator_getPages(feedWith: PageFeedWith, text: string) {
		const container = new Container();
		container.bind<IPageFeeder>(TYPES.IPageFeeder).to(MockPageFeeder);
		const rpg = container.resolve(RenderablePageGenerator);

		const page = new Page("foo", "bar {{page.project.name}}", feedWith);
		const docProject = new DocProject("my_project");
		const pages = Array.from(rpg.getPages(page, docProject));
		Expect(pages[0].inputFile).toBe("foo");
		Expect(pages[0].outputFile).toBe("bar " + text);
		Expect(pages[0].encodedData.page.project.name).toBe(text);
	}

}
