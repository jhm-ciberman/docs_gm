import { injectable } from "inversify";
import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMResource from "../../../src/gm_project/interfaces/IGMResource";

/* tslint:disable:completed-docs */

@injectable()
export default class MockGMFolder implements IGMFolder {

	public fullpath: string = "";
	public name: string;
	public parent: IGMFolder | null = null;
	public mockChildren: IGMResource[];
	constructor(name: string, mockChildren: IGMResource[]) {
		this.name = name;
		this.mockChildren = mockChildren;
		for (const child of mockChildren) {
			child.parent = this;
		}
	}
	get children(): IterableIterator<IGMResource> {
		return this.mockChildren[Symbol.iterator]();
	}
	public addChild(_child: IGMResource): void {
		throw new Error("Method not implemented.");
	}
	public getSubtreeLeafs(): IGMResource[] {
		throw new Error("Method not implemented.");
	}
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}
}
