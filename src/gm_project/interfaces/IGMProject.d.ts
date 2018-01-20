import IGMResource from "./IGMResource";
import IGMFolder from "./IGMFolder";

/**
 * Represents a single GameMaker Project
 */
export default interface IGMProject {
	readonly path: string;
	readonly name: string;
	find(pattern: string): IGMResource[];
	addTopLevelFolder(folder: IGMFolder): void;
}