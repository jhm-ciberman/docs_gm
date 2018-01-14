import IReporter from "./IReporter";

/* istambul ignore next */
/**
 * Reporter manager class
 */
export default class ReporterManager {

	/**
	 * Reporter used
	 */
	public static reporter: IReporter = console;

}
