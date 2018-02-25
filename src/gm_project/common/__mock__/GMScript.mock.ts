import IGMFolder from "../../interfaces/IGMFolder";
import IGMScript from "../../interfaces/IGMScript";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMScriptMock implements IGMScript {
	public filepath: string = "";
	public parent: IGMFolder | null = null;
	public fullpath: string = "";
	public name: string = "";
	public subScripts(): IterableIterator<[string, string]> {
		throw new Error("Method not implemented.");
	}
	public loadFromString(_str: string): void {
		throw new Error("Method not implemented.");
	}
}
