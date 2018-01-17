import IGMResource from "./IGMResource";

/**
 * Represents a Single GameMaker Folder
 */
export default interface IGMFolder extends IGMResource {
	readonly children: IGMResource[];
}