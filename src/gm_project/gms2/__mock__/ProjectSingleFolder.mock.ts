import GMS2ResourceType from "../GMS2ResourceType";
import { IFolder, IProject } from "../IGMS2Descriptor";

export const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "ResourceTree_Scripts",
	children: [],
};

export const project: IProject = {
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
