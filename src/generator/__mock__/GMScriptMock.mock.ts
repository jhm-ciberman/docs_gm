import GMScript from "../../gm_project/common/GMScript";
import IGMFolder from "../../gm_project/interfaces/IGMFolder";

export default class GMScriptMock extends GMScript {
	public filepath: string;
	public parent: IGMFolder | null = null;
	constructor(name: string, filepath: string) {
		super(name);
		this.filepath = filepath;
	}
	public * subScripts(): IterableIterator<[string, string]> {
		const gml = [
			"/**",
			" * My documentation ",
			" */",
		];
		yield ["my-script", gml.join("\n")];
	}
	public loadFromString(str: string): void {
		if (str !== "a" && str !== "b") {
			throw new Error("Invalid arguments to mock loadFromString");
		}
	}
}
