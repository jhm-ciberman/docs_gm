import { injectable } from "inversify";
import GMSubscript from "../../src/gm_project/GMSubscript";
import IGMFolder from "../../src/gm_project/interfaces/IGMFolder";
import IGMScript from "../../src/gm_project/interfaces/IGMScript";

/* tslint:disable:completed-docs */

@injectable()
export default class MockGMScript implements IGMScript {
	public name: string;
	public fullpath: string = "";
	public filepath: string = "";
	public parent: IGMFolder | null = null;

	constructor(name: string) {
		this.name = name;
	}
	public * subScripts(): IterableIterator<GMSubscript> {
		throw new Error("Method not implemented.");
	}
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}

}
