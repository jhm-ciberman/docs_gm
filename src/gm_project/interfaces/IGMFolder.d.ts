import IGMResource from "./IGMResource";

/**
 * Represents a Single GameMaker Folder
 */
export default interface IGMFolder extends IGMResource {
	/**
	 * The fullpath of the resource
	 */
	readonly fullpath: string;
	/**
	 * An iterator with the folder children
	 */
	readonly children: IterableIterator<IGMResource>;

	/**
	 * Ads a child resource
	 */
	addChild(child: IGMResource): void;


}