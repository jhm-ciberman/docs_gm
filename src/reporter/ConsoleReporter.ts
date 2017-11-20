import IReporter from "./IReporter";

/* tslint:disable:no-console */
/*
This is the only class allowed to have console.log as an output
All other classes should use the Reporter class.
Normally, you can access the reporter class via DocsGM.reporter.
For example: DocsGM.reporter.info("hi");
*/

/**
 * Console Reporter
 */
export default class ConsoleReporter implements IReporter {

	/**
	 * Shows a debug string on the screen
	 * @param str The string
	 */
	public debug(...str: any[]) {
		console.log(...str);
	}

	/**
	 * Shows an info string on the screen
	 * @param str The string
	 */
	public info(...str: any[]) {
		console.info(...str);
	}

	/**
	 * Shows a warn string on the screen
	 * @param str The string
	 */
	public warn(...str: any[]) {
		str[0] = "> WARNING: " + str[0];
		console.warn(...str);
	}

	/**
	 * Shows an error string on the screen
	 * @param str The string
	 */
	public error(...str: any[]) {
		console.error(...str);
	}

}
