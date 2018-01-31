import {
	AsyncSetupFixture,
	Expect,
	TeardownFixture,
	Test,
	TestFixture,
} from "alsatian";

import * as nunjucks from "nunjucks";
import { TempDir } from "../../_testing_helpers/TempDir.help";
import DocProject from "../models/DocProject";
import DocScript from "../models/DocScript";
import Page from "./Page";
import PageFeedWith from "./PageFeedWith";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("Page")
export class PageFixture {

	public env: nunjucks.Environment;

	public script1: DocScript;

	public script2: DocScript;

	public docProject: DocProject;

	public tempDir: TempDir;

	@AsyncSetupFixture
	public async setupFixture() {

		this.script1 = new DocScript();
		this.script1.name = "my_script_name1";

		this.script2 = new DocScript();
		this.script2.name = "my_script_name2";

		this.docProject = new DocProject();
		this.docProject.name = "My project name";
		this.docProject.scripts.push(this.script1);
		this.docProject.scripts.push(this.script2);

		this.tempDir = TempDir.create("path", {
			"page_script.njk": `<h1>{{ page.script.name }}</h1>`,
			"page_scripts.njk": `<h1>{{ page.scripts[0].name }}</h1>`,
		});

		this.env = nunjucks.configure(this.tempDir.dir, { autoescape: false });
	}

	@TeardownFixture
	public teardownFixture() {
		TempDir.removeAll();
	}

	@Test()
	public test() {
		Expect(true).toBe(true);
	}

	@Test("should render the page with a multipage template")
	public generateMultipage() {
		const input = this.tempDir.join("page_script.njk");
		const output = this.tempDir.join("{{ page.script.name }}.html");
		const page = new Page(input, output, PageFeedWith.Script);

		const it = page.generate(this.env, this.docProject);

		const [filename1, content1] = it.next().value;
		Expect(filename1).toBe(this.tempDir.join("my_script_name1.html"));
		Expect(content1).toBe("<h1>my_script_name1</h1>");

		const [filename2, content2] = it.next().value;
		Expect(filename2).toBe(this.tempDir.join("my_script_name2.html"));
		Expect(content2).toBe("<h1>my_script_name2</h1>");

		Expect(it.next().done).toBe(true);
	}

	@Test("should render the page with a onepage template")
	public generateOnepage() {
		const input = this.tempDir.join("page_scripts.njk");
		const output = this.tempDir.join("out.html");
		const page = new Page(input, output, PageFeedWith.Scripts);

		const it = page.generate(this.env, this.docProject);

		const [filename, content] = it.next().value;
		Expect(filename).toBe(this.tempDir.join("out.html"));
		Expect(content).toBe("<h1>my_script_name1</h1>");

		Expect(it.next().done).toBe(true);
	}
}
