import IGMProject from "./IGMProject";

export default interface IGMProjectFactory {
	load(): Promise<IGMProject>
}