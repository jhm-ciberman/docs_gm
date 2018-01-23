import {
	Expect,
	Test,
	TestFixture,
} from "alsatian";

import DocExample from "./DocExample";
import DocFolder from "./DocFolder";
import DocPage from "./DocPage";
import DocParam from "./DocParam";
import DocProject from "./DocProject";
import DocResource from "./DocResource";
import DocReturns from "./DocReturns";
import DocScript from "./DocScript";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("DocExample")
export class DocExampleFixture {
	@Test("should have default values")
	public test() {
		const example = new DocExample();
		Expect(example.caption).toBeNull();
		Expect(example.code).toBeNull();
	}
}

@TestFixture("DocFolder")
export class DocFolderFixture {
	@Test("should have default values")
	public test() {
		const folder = new DocFolder();
		Expect(folder.children.length).toBe(0);
		Expect(folder.name).toBe("");
		Expect(folder.parent).toBeNull();
		Expect(folder.type).toBe("folder");
	}
}

@TestFixture("DocPage")
export class DocPageFixture {
	@Test("should have default values")
	public test() {
		const page = new DocPage();
		Expect(page.project).toBe(undefined as any);
		Expect(page.script).toBe(undefined as any);
		Expect(page.scripts).toBe(undefined as any);
	}
}

@TestFixture("DocParam")
export class DocParamFixture {
	@Test("should have default values")
	public test() {
		const param = new DocParam();
		Expect(param.description).toBeNull();
		Expect(param.name).toBeNull();
		Expect(param.optional).toBe(false);
		Expect(param.type).toBeNull();
	}
}

@TestFixture("DocProject")
export class DocProjectFixture {
	@Test("should have default values")
	public test() {
		const project = new DocProject();
		Expect(project.name).toBe("");
		Expect(project.scripts.length).toBe(0);
	}
}

@TestFixture("DocResource")
export class DocResourceFixture {
	@Test("should have default values")
	public test() {
		class DocResourceMock extends DocResource {
			public type: string = "mock";
		}
		const resource = new DocResourceMock();
		Expect(resource.type).toBe("mock");
		Expect(resource.parent).toBeNull();
		Expect(resource.name).toBe("");
	}
}

@TestFixture("DocReturns")
export class DocReturnsFixture {
	@Test("should have default values")
	public test() {
		const ret = new DocReturns();
		Expect(ret.description).toBeNull();
		Expect(ret.type).toBeNull();
	}
}

@TestFixture("DocScript")
export class DocScriptFixture {
	@Test("should have default values")
	public test() {
		const script = new DocScript();
		Expect(script.description).toBe(null);
		Expect(script.examples.length).toBe(0);
		Expect(script.params.length).toBe(0);
		Expect(script.parent).toBeNull();
		Expect(script.private).toBe(false);
		Expect(script.return).toBeNull();
		Expect(script.returns).toBeNull();
		Expect(script.type).toBe("script");
		Expect(script.undocumented).toBe(true);
	}
}
