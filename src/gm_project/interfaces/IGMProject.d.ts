import IGMResource from "./IGMResource";
import IGMFolder from "./IGMFolder";

/**
 * Represents a single GameMaker Project
 */
export default interface IGMProject extends IGMFolder {
	/**
	 * The path of the GM project
	 */
	readonly path: string;
	
	/**
	 * The name of the GM project
	 */
	readonly name: string;

	/**
	 * An iterator with the top level folders
	 */
	readonly children: IterableIterator<IGMFolder>;

	/**
	 * Ads a child top level folder
	 */
	addChild(child: IGMFolder): void;
}