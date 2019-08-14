import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocFolder from "../../../src/doc_models/DocFolder";
import DocProject from "../../../src/doc_models/DocProject";
import DocScript from "../../../src/doc_models/DocScript";
import RenderingQueueBuilder from "../../../src/renderer/RenderingQueueBuilder";

@TestFixture()
export class RenderingQueueBuilderFixture {

	@Test()
	public render_scriptPagesTrue_folderPagesTrue() {
		const project = this._createProject();
		const builder = new RenderingQueueBuilder(project, {scriptPages: true, folderPages: true});
		const queue = builder.build();

		const pages = Array.from(queue.pages);
		Expect(pages.length).toBe(3);

		Expect(pages[0].name).toBe("index");
		Expect(pages[0].resource.name).toBe("my project");

		Expect(pages[1].name).toBe("my_subfolder");

		Expect(pages[2].name).toBe("my_script");
	}

	@Test()
	public render_scriptPagesFalse_folderPagesFalse() {
		const project = this._createProject();
		const builder = new RenderingQueueBuilder(project, {scriptPages: false, folderPages: false});
		const queue = builder.build();

		const pages = Array.from(queue.pages);
		Expect(pages.length).toBe(1);
		Expect(pages[0].name).toBe("index");
		Expect(pages[0].resource.name).toBe("my project");
	}

	@Test()
	public render_scriptPagesTrue_folderPagesFalse() {
		const project = this._createProject();
		const builder = new RenderingQueueBuilder(project, {scriptPages: true, folderPages: false});
		const queue = builder.build();

		const pages = Array.from(queue.pages);
		Expect(pages.length).toBe(2);
		Expect(pages[0].name).toBe("index");
		Expect(pages[0].resource.name).toBe("my project");

		Expect(pages[1].name).toBe("my_script");
	}

	@Test()
	public render_scriptPagesFalse_folderPagesTrue() {
		const project = this._createProject();
		const builder = new RenderingQueueBuilder(project, {scriptPages: false, folderPages: true});
		const queue = builder.build();

		const pages = Array.from(queue.pages);
		Expect(pages.length).toBe(2);
		Expect(pages[0].name).toBe("index");
		Expect(pages[0].resource.name).toBe("my project");

		Expect(pages[1].name).toBe("my_subfolder");
	}

	private _createProject(): DocProject {
		const project = new DocProject("my project");
		project.root = new DocFolder("my_folder", project);

		const subfolder = new DocFolder("my_subfolder", project);
		project.root.children.push(subfolder);
		subfolder.parent = project.root;

		const script = new DocScript("my_script", project);
		script.parent = subfolder;
		subfolder.children.push(script);

		return project;
	}
}
