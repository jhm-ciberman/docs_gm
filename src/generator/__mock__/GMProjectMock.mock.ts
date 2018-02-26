import IGMFolder from "../../gm_project/interfaces/IGMFolder";
import IGMProject from "../../gm_project/interfaces/IGMProject";
import GMFolderMock from "./GMFolderMock.mock";

export default class GMProjectMock extends GMFolderMock implements IGMProject {
	public fullpath: string;
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
