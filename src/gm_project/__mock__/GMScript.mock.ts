import GMScript from "../GMScript";
import IGMFolder from "../interfaces/IGMFolder";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMScriptMock extends GMScript {
	public mockFullpath: string = "";
	public get fullpath(): string {
		return this.mockFullpath;
	}
	public parent: IGMFolder | null = null;
	public filepath: string = "";
	public subScripts(): IterableIterator<[string, string]> {
		throw new Error("Method not implemented.");
	}
	public loadFromString(_str: string): void {
		throw new Error("Method not implemented.");
	}
}
