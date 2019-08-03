import IGMFolder from "../gm_project/IGMFolder";

export default interface IProjectRootFinder {
	find(folder: IGMFolder, path: string): IGMFolder;
}