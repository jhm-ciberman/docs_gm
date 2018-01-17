import IGMResource from "./IGMResource";

/**
 * Represents a single GameMaker Project
 */
export default interface IGMProject {
	readonly path: string;
	readonly name: string;
	find(pattern: string): IGMResource[];
}