import Design from "../../../src/template/Design";
import { ITemplate } from "../../../src/template/ITemplate";

export default class MockTemplate implements ITemplate {
	public folder: string;
	public author: string | undefined;
	public defaultDesign: Design;
	public description: string | undefined;
	public web: string | undefined;
	public getDesign(_design: string): Design | undefined {
		throw new Error("Method not implemented.");
	}
	public hasDesign(_design: string): boolean {
		throw new Error("Method not implemented.");
	}
	public designs(): IterableIterator<Design> {
		throw new Error("Method not implemented.");
	}
	public findDesign(_designName: string): Design {
		throw new Error("Method not implemented.");
	}
}
