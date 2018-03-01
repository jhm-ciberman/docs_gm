import { injectable } from "inversify";
import IGMFolder from "../../src/gm_project/interfaces/IGMFolder";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

/* tslint:disable:completed-docs */

@injectable()
export default class MockGMScript implements IGMScript {
	public fullpath: string;
	public name: string;
	public filepath: string;
	public parent: IGMFolder | null = null;
	public mockFullpath: string;

	constructor(name: string, fullpath: string, filepath: string) {
		this.name = name;
		this.fullpath = fullpath;
		this.filepath = filepath;
	}
	public * subScripts(): IterableIterator<[string, string]> {
		throw new Error("Method not implemented.");
	}
	public loadFromString(_str: string): void {
		throw new Error("Method not implemented.");
	}
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}

}
