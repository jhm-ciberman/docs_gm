import * as mock from "mock-fs";
import * as xml2js from "xml2js";
import { IRoot } from "./GMS1Descriptor";
import GMS1Project from "./GMS1Project";

// Mock XML project
const mockProject: { assets: IRoot } = {
	assets: {
		scripts: [
			{
				$: {
					name: "scripts-root",
				},
				script: [
					"my-script-a",
					"my-script-b",
					"my-script-c",
				],
			},
		],
	},
};

describe("GMS1Project", () => {

	let project: GMS1Project;

	beforeAll( () => {
		const b = new xml2js.Builder();
		mock({
			"path/to/my-project/my-project.xml": b.buildObject(mockProject),
		});
		return GMS1Project.loadProject("path/to/my-project/my-project.xml").then((p) => {
			project = p;
		});
	});

	afterAll(() => {
		mock.restore();
	});

	test("should extract project name", () => {
		expect(project.name).toBe("my-project");
	});

	test("should get project path", () => {
		expect(project.path).toBe("path/to/my-project");
	});

});
