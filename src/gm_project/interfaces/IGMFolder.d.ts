import IGMResource from "./IGMResource";

/**
 * Represents a Single GameMaker Folder
 */
export default interface IGMFolder extends IGMResource {
	/**
	 * An iterator with the folder children
	 */
	readonly children: IterableIterator<IGMResource>;

	/**
	 * Ads a child resource
	 */
	addChild(child: IGMResource): void;
}