import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMResource from "../../../src/gm_project/interfaces/IGMResource";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMFolderMock implements IGMFolder {
	public fullpath: string;
	public children: IterableIterator<IGMResource>;
	public parent: IGMFolder | null = null;
	public name: string;
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
