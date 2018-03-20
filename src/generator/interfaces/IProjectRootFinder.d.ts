import IGMFolder from "../../gm_project/interfaces/IGMFolder";

export default interface IProjectRootFinder {
	find(folder: IGMFolder, path: string): IGMFolder;
}