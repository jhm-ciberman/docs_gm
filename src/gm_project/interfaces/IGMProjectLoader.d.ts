import IGMProject from "./IGMProject";

export default interface IGMProjectLoader {
	/**
	 * Loads a project file and returns a GMProject
	 */
	load(file: string): Promise<IGMProject>
}