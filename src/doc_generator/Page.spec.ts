import * as mock from "mock-fs";
import * as nunjucks from "Nunjucks";
import DocProject from "../docs_models/DocProject";
import DocScript from "../docs_models/DocScript";
import Page from "./Page";

describe("Page", () => {
	let env: nunjucks.Environment;

	const script1 = new DocScript();
	script1.name = "my_script_name1";

	const script2 = new DocScript();
	script2.name = "my_script_name2";

	const docProject = new DocProject();
	docProject.name = "My project name";
	docProject.scripts.push(script1);
	docProject.scripts.push(script2);

	beforeAll(() => {
		mock({
			"path/page_script.njk": `<h1>{{ page.script.name }}</h1>`,
			"path/page_scripts.njk": `<h1>{{ page.scripts[0].name }}</h1>`,
		});
		env = nunjucks.configure("path", { autoescape: false });
	});

	afterAll(() => {
		mock.restore();
	});

	test("should render the page with a multipage template", () => {
		const page = new Page("page_script.njk", "{{ page.script.name }}.html", "script");

		const it = page.generate(env, docProject);

		const [filename1, content1] = it.next().value;
		expect(filename1).toBe("my_script_name1.html");
		expect(content1).toBe("<h1>my_script_name1</h1>");

		const [filename2, content2] = it.next().value;
		expect(filename2).toBe("my_script_name2.html");
		expect(content2).toBe("<h1>my_script_name2</h1>");

		expect(it.next().done).toBe(true);
	});

	test("should render the page with a onepage template", () => {
		const page = new Page("page_scripts.njk", "out.html", "scripts");

		const it = page.generate(env, docProject);

		const [filename, content] = it.next().value;
		expect(filename).toBe("out.html");
		expect(content).toBe("<h1>my_script_name1</h1>");

		expect(it.next().done).toBe(true);
	});
});
