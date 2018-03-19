import {
	Expect,
	Test,
	TestCase,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import ProjectRootFinder from "../../../src/generator/ProjectRootFinder";
import MockGMFolder from "../__mock__/MockGMFolder.mock";
import MockGMProject from "../__mock__/MockGMProject.mock";
import MockGMScript from "../__mock__/MockGMScript.mock";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ProjectRootFinder")
export class ProjectRootFinderFixture {

	@TestCase("scripts/subfolder", "subfolder")
	@TestCase("scripts//subfolder", "subfolder")
	@TestCase("/scripts/subfolder/", "subfolder")
	@TestCase("/scripts/////", "scripts")
	@Test()
	public ProjectRootFinder_normal(find: string, expected: string) {
		const p = new MockGMProject("my project", [
			new MockGMFolder("scripts", [
				new MockGMScript("my_script"),
				new MockGMFolder("subfolder", [
					new MockGMScript("other_script"),
				]),
			]),
		]);

		const container = new Container();
		const finder = container.resolve(ProjectRootFinder);

		Expect(finder.find(p, find).name).toBe(expected);
	}

	@Test()
	public ProjectRootFinder_throw_no_root() {
		const p = new MockGMProject("my project", []);

		const container = new Container();
		const finder = container.resolve(ProjectRootFinder);
		Expect(() => finder.find(p, "scripts")).toThrow();
	}

}
