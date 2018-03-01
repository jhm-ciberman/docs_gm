import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMProject from "../../../src/gm_project/interfaces/IGMProject";
import GMFolderMock from "./GMFolderMock.mock";

/* tslint:disable:completed-docs */

export default class GMProjectMock extends GMFolderMock implements IGMProject {
	public parent: IGMFolder | null;
	public path: string = "";
	public mockChildren: IGMFolder[];
	constructor(name: string, mockChildren: IGMFolder[]) {
		super(name, mockChildren);
	}
	get children(): IterableIterator<IGMFolder> {
		return this.mockChildren[Symbol.iterator]();
	}
}
