import IGMProject from "./IGMProject";

export default interface IGMProjectFactory {
	/**
	 * Loads a project file and returns a GMProject
	 */
	load(): Promise<IGMProject>
}