import IReporter from "./interfaces/IReporter";

/**
 * Reporter manager class
 */
export default class ReporterManager {

	/**
	 * Reporter used
	 */
	public static reporter: IReporter = console;

}
