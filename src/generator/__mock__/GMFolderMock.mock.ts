import IGMFolder from "../../gm_project/interfaces/IGMFolder";
import IGMResource from "../../gm_project/interfaces/IGMResource";

/* tslint:disable:completed-docs */

export default class GMFolderMock implements IGMFolder {

	public fullpath: string;
	public name: string;
	public parent: IGMFolder | null = null;
	public mockChildren: IGMResource[];
	constructor(name: string, mockChildren: IGMResource[]) {
		this.name = name;
		this.mockChildren = mockChildren;
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
		return true;
	}
}
