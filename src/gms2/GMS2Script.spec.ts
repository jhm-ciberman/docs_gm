import GMS2Script from "../../src/gms2/GMS2Script";

let script: GMS2Script;

beforeEach(() => {
	script = new GMS2Script({
		id: "my-id",
		name: "my-name",
	});
});

describe("GMS2Script", () => {

	test("should load a script and get the script content and name through an iterator", () => {
		script.loadFromString("my-gml-content");
		const it = script.subScripts().next();
		expect(it.value).toMatchObject(["my-name", "my-gml-content"]);
		expect(it.done).toBe(true);
	});

	test("should get the filepath of the gml file of a non-compatibility script", () => {
		script.isCompatibility = false;
		expect(script.filepath).toBe("scripts/my-name/my-name.gml");
	});

	test("should get the filepath of the gml file of a compatibility script", () => {
		script.isCompatibility = true;
		expect(script.filepath).toBe("scripts/@my-name/my-name.gml");
	});

	test("should throw when calling subScripts() without calling loadFromString", () => {
		expect(() => {
			script.subScripts().next();
		}).toThrow();
	});

});
