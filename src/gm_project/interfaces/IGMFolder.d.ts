import IGMResource from "./IGMResource";
import IGMScript from "./IGMScript";

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

	/**
	 * Returns the first GMScript whose name starts with "MODULE_" or with "FOLDER_".
	 */
	readonly moduleScript: IGMScript | null
}