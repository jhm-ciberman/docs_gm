import GMS2Resource from "../../src/gms2/GMS2Resource";
import * as IGMS2Descriptor from "../../src/gms2/IGMS2Descriptor";
import MockGMS2Project from "./__mocks__/GMS2Project.mock";

describe("when creating a new resource instance", () => {
	it("should get the resource name and project in the constructor", () => {
		const data: IGMS2Descriptor.IResource = {
			name: "my-name",
			id: "my-id",
			modelName: "my-model-name",
			mvc: "my-mvc",
		};
		const mockProject = new MockGMS2Project();

		const resource = new GMS2Resource(data, mockProject);

		expect(resource.name).toBe("my-name");
		expect(resource.project).toBe(mockProject);
	});
});
expect(1).toBe(1);
