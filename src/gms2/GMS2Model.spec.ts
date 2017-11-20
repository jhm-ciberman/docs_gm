import GMS2Model from "../../src/gms2/GMS2Model";
import * as IGMS2Descriptor from "../../src/gms2/IGMS2Descriptor";

// GMS2Model is an abstract class and cannot be instantiated, no we need to use a mock
class MockGMS2Model extends GMS2Model {}

it("should extract basic data", () => {
	const modelData: IGMS2Descriptor.IModel = {
		mvc: "123",
		modelName: "foo",
		id: "bar",
	};

	const model = new MockGMS2Model(modelData);

	expect(model.mvc).toBe("123");
	expect(model.modelName).toBe("foo");
	expect(model.id).toBe("bar");
});
