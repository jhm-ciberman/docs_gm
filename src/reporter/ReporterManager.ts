import ConsoleReporter from "./ConsoleReporter";
import IReporter from "./IReporter";

export default class ReporterManager {

	public static reporter: IReporter = new ConsoleReporter();

}
