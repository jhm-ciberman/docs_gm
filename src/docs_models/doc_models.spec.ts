import DocExample from "./DocExample";
import DocFolder from "./DocFolder";
import DocPage from "./DocPage";
import DocParam from "./DocParam";
import DocProject from "./DocProject";
import DocResource from "./DocResource";
import DocReturns from "./DocReturns";
import DocScript from "./DocScript";

describe("DocExample", () => {
	it("should have default values", () => {
		const example = new DocExample();
		expect(example.caption).toBeNull();
		expect(example.code).toBeNull();
	});
});

describe("DocFolder", () => {
	it("should have default values", () => {
		const folder = new DocFolder();
		expect(folder.children.length).toBe(0);
		expect(folder.name).toBe("");
		expect(folder.parent).toBeNull();
		expect(folder.type).toBe("folder");
	});
});

describe("DocPage", () => {
	it("should have default values", () => {
		const page = new DocPage();
		expect(page.project).toBeUndefined();
		expect(page.script).toBeUndefined();
		expect(page.scripts).toBeUndefined();
	});
});

describe("DocParam", () => {
	it("should have default values", () => {
		const param = new DocParam();
		expect(param.description).toBeNull();
		expect(param.name).toBeNull();
		expect(param.optional).toBe(false);
		expect(param.type).toBeNull();
	});
});

describe("DocProject", () => {
	it("should have default values", () => {
		const project = new DocProject();
		expect(project.name).toBe("");
		expect(project.scripts.length).toBe(0);
	});
});

describe("DocResource", () => {
	// It's an abstract class, so, it need to be a parent class in order to be instantiated
	class DocResourceMock extends DocResource {
		public type: string = "mock";
	}
	it("should have default values", () => {
		const resource = new DocResourceMock();
		expect(resource.type).toBe("mock");
		expect(resource.parent).toBeNull();
		expect(resource.name).toBe("");
	});
});

describe("DocReturns", () => {
	it("should have default values", () => {
		const ret = new DocReturns();
		expect(ret.description).toBeNull();
		expect(ret.type).toBeNull();
	});
});

describe("DocScript", () => {
	it("should have default values", () => {
		const script = new DocScript();
		expect(script.description).toBe(null);
		expect(script.examples.length).toBe(0);
		expect(script.params.length).toBe(0);
		expect(script.parent).toBeNull();
		expect(script.private).toBe(false);
		expect(script.return).toBeNull();
		expect(script.returns).toBeNull();
		expect(script.type).toBe("script");
		expect(script.undocumented).toBe(true);
	});
});
