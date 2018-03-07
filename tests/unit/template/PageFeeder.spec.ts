import {
	AsyncTest,
	Expect,
	Setup,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocResource from "../../../src/doc_models/DocResource";
import DocScript from "../../../src/doc_models/DocScript";
import IPageFeeder from "../../../src/template/interfaces/IPageFeeder";
import PageFeeder from "../../../src/template/PageFeeder";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocProjectGenerator")
export class DocProjectGeneratorFixture {

	public pageFeeder: IPageFeeder;

	public docProject: DocProject;

	@Setup
	public setup() {
		this.docProject = new DocProject("my-project");
		const f = new DocFolder("my_folder");
		const script1 = new DocScript("my_script1");
		const script2 = new DocScript("my_script2");
		class MockDocResource extends DocResource {
			public type: string = "mock";
		}
		const resource = new MockDocResource("mock_resource");
		f.children.push(script1);
		f.children.push(script2);
		f.children.push(resource);
		this.docProject.scripts.children.push(f);

		const container = new Container();
		this.pageFeeder = container.resolve(PageFeeder);
	}

	@AsyncTest("pageFeeder_allTheScriptsInOnePage")
	public async pageFeeder_allTheScriptsInOnePage() {
		const arr = Array.from(this.pageFeeder.allTheScriptsInOnePage(this.docProject));
		Expect(arr.length).toBe(1);
		Expect(arr[0].scripts.length).toBe(2);
		Expect(arr[0].scripts[0].name).toBe("my_script1");
		Expect(arr[0].scripts[1].name).toBe("my_script2");
	}

	@AsyncTest("pageFeeder_oneScriptPerPage")
	public async pageFeeder_oneScriptPerPage() {
		const arr = Array.from(this.pageFeeder.oneScriptPerPage(this.docProject));
		Expect(arr.length).toBe(2);
		Expect((arr[0].script as DocScript).name).toBe("my_script1");
		Expect((arr[1].script as DocScript).name).toBe("my_script2");
	}
}
