import GMScript from "../../gm_project/GMScript";
import IGMFolder from "../../gm_project/interfaces/IGMFolder";

/* tslint:disable:completed-docs */

export default class GMScriptMock extends GMScript {
	public filepath: string;
	public parent: IGMFolder | null = null;
	public mockFullpath: string;

	constructor(name: string, fullpath: string) {
		super(name);
		this.mockFullpath = fullpath;
	}
	get fullpath() {
		return this.mockFullpath;
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
	public match(_pattern: string): boolean {
		return true;
	}

}
