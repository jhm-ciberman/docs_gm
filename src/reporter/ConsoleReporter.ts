import { injectable } from "inversify";
import IReporter from "./IReporter";

/**
 * The standard console reporter
 */
@injectable()
export default class ConsoleReporter implements IReporter {
	/**
	 * Show a debug message
	 * @param str The message
	 */
	public debug(...str: any[]): void {
		// tslint:disable-next-line:no-console
		console.debug(...str);
	}
	/**
	 * Show a info message
	 * @param str The message
	 */
	public info(...str: any[]): void {
		// tslint:disable-next-line:no-console
		console.info(...str);
	}
	/**
	 * Show a warn message
	 * @param str The message
	 */
	public warn(...str: any[]): void {
		// tslint:disable-next-line:no-console
		console.warn(...str);
	}
	/**
	 * Show a error message
	 * @param str The message
	 */
	public error(...str: any[]): void {
		// tslint:disable-next-line:no-console
		console.error(...str);
	}
}
