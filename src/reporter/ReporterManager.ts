import ConsoleReporter from "./ConsoleReporter";
import IReporter from "./IReporter";

/**
 * Reporter manager class
 */
export default class ReporterManager {

	/**
	 * Reporter used
	 */
	public static reporter: IReporter = new ConsoleReporter();

}
