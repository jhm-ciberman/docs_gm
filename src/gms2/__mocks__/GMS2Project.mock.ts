import { IGMResource } from "../../IGMInterfaces";
import GMS2Resource from "../GMS2Resource";
import IGMS2Project from "../IGMS2Project";

export default class MockGMS2Project implements IGMS2Project {
	public path: string;
	public name: string;
	public getResourceById(_id: string): GMS2Resource | undefined {
		throw new Error("Method not implemented.");
	}

	public load(): Promise<this> {
		throw new Error("Method not implemented.");
	}

	public print(_spaces?: number | undefined): void {
		throw new Error("Method not implemented.");
	}

	public find(_pattern: string, _type?: string | undefined): IGMResource[] {
		throw new Error("Method not implemented.");
	}

	public addResource(_resource: IGMResource, _type: string): void {
		throw new Error("Method not implemented.");
	}
}
