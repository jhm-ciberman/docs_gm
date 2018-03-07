import { injectable } from "inversify";
import IReporter from "../../../src/reporter/interfaces/IReporter";

/* tslint:disable:completed-docs */

@injectable()
export default class MockReporter implements IReporter {
	public debug(..._str: any[]): void {
		throw new Error("Method not implemented.");
	}
	public info(..._str: any[]): void {
		throw new Error("Method not implemented.");
	}
	public warn(..._str: any[]): void {
		throw new Error("Method not implemented.");
	}
	public error(..._str: any[]): void {
		throw new Error("Method not implemented.");
	}
}
