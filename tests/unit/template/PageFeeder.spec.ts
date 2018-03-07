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
import { ISerializedFolder, ISerializedScript } from "../../../src/doc_models/interfaces/interfaces";
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
		const page = arr[0].serialize();
		Expect(page.scripts.length).toBe(2);
		Expect((page.scripts[0] as ISerializedScript).name).toBe("my_script1");
		Expect((page.scripts[1] as ISerializedScript).name).toBe("my_script2");
	}

	@AsyncTest("pageFeeder_oneScriptPerPage")
	public async pageFeeder_oneScriptPerPage() {
		const arr = Array.from(this.pageFeeder.oneScriptPerPage(this.docProject));
		Expect(arr.length).toBe(2);
		Expect((arr[0].serialize().script as ISerializedScript).name).toBe("my_script1");
		Expect((arr[1].serialize().script as ISerializedScript).name).toBe("my_script2");
	}

	@AsyncTest("pageFeeder_oneFolderPerPage")
	public async pageFeeder_oneFolderPerPage() {
		const arr = Array.from(this.pageFeeder.oneFolderPerPage(this.docProject));
		Expect(arr.length).toBe(2);
		Expect((arr[0].serialize().folder as ISerializedFolder).name).toBe("scripts");
		Expect((arr[1].serialize().folder as ISerializedFolder).name).toBe("my_folder");
	}
}
