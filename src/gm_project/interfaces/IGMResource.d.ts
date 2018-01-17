import IGMFolder from "./IGMFolder";

/**
 * Represents a single GameMaker Resource
 */
export default interface IGMResource {
	parent: IGMFolder | null;
	fullpath: string;
	name: string;
}