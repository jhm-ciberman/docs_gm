import GMS1Script from "./GMS1Script";

const mockGML = `
#define my_script_1
return "foo";
#define my_script_2
return "bar";`;

describe("GMS1Script", () => {
	const script = new GMS1Script("path/to/my_script.gml", null);

	test("should get the filepath", () => {
		expect(script.filepath).toBe("path/to/my_script.gml");
	});

	test("should loadFromString() multiple scripts", () => {
		return script.loadFromString(mockGML).then(() => {
			const it = script.subScripts();
			const [name1, gml1] = it.next().value;
			expect(name1).toBe("my_script_1");
			expect(gml1).toBe('return "foo";');

			const [name2, gml2] = it.next().value;
			expect(name2).toBe("my_script_2");
			expect(gml2).toBe('return "bar";');
		});
	});

});
