import GMS2ResourceType from "../../../../../src/gm_project/gms2/GMS2ResourceType";
import { IFolder, IProject } from "../../../../../src/gm_project/gms2/IGMS2Descriptor";

const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "ResourceTree_Scripts",
	children: [],
};

const project: IProject = {
	resources: [
		{
			Key: "my-key-folder",
			Value: {
				id: "my-folder-id",
				resourcePath: "my_folder.json",
				resourceType: GMS2ResourceType.GMFolder,
			},
		},
	],
};

const projectSingleFolder = {project, folder};
export default projectSingleFolder;
