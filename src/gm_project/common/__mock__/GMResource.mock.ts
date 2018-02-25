import IGMFolder from "../../interfaces/IGMFolder";
import IGMResource from "../../interfaces/IGMResource";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMResourceMock implements IGMResource {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
}
