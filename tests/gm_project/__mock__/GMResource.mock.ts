import IGMFolder from "../../../src/gm_project/interfaces/IGMFolder";
import IGMResource from "../../../src/gm_project/interfaces/IGMResource";

/* tslint:disable:max-classes-per-file completed-docs */

export default class GMResourceMock implements IGMResource {
	public parent: IGMFolder | null;
	public fullpath: string;
	public name: string;
	public match(_pattern: string): boolean {
		throw new Error("Method not implemented.");
	}
}
