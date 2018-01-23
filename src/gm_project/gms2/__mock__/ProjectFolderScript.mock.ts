import GMS2ResourceType from "../GMS2ResourceType";
import { IFolder, IProject, IScript } from "../IGMS2Descriptor";

export const script: IScript = {
	modelName: GMS2ResourceType.GMScript,
	id: "my-script-id",
	name: "my_script",
	IsCompatibility: false,
	IsDnD: false,
};

export const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "ResourceTree_Scripts",
	children: [
		"my-key-script",
	],
};

export const project: IProject = {
	resources: [
		{
			Key: "my-key-script",
			Value: {
				id: "my-script-id",
				resourcePath: "my_script.json",
				resourceType: GMS2ResourceType.GMScript,
			},
		},
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
