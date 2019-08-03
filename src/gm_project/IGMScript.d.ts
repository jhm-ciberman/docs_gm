import IGMResource from "./IGMResource";
import GMSubscript from "./GMSubscript";

export default interface IGMScript extends IGMResource {
	/**
	 * The file location of the GML file
	 */
	readonly filepath: string;

	/**
	 * Returns an iterator with each SubScript in this script
	 */
	subScripts(gmlText: string): IterableIterator<GMSubscript>;
}
