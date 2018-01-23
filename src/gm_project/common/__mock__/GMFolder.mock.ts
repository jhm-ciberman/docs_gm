import IGMFolder from "../../interfaces/IGMFolder";
import IGMResource from "../../interfaces/IGMResource";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMFolderMock implements IGMFolder {
	public fullpath: string;
	public children: IterableIterator<IGMResource>;
	public parent: IGMFolder | null;
	public name: string;
	public addChild(_child: IGMResource): void {
		throw new Error("Method not implemented.");
	}
	public getSubtreeLeafs(): IGMResource[] {
		throw new Error("Method not implemented.");
	}
}
