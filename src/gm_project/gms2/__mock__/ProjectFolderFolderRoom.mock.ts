import GMS2ResourceType from "../GMS2ResourceType";
import { IFolder, IProject, IResource } from "../IGMS2Descriptor";

export const room: IResource = {
	modelName: GMS2ResourceType.GMRoom,
	id: "my-room-id",
	name: "my_room",
};

export const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "",
	children: [
		"my-key-room",
	],
};

export const rootFolder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-root-folder-id",
	name: "my_root_folder",
	folderName: "my_root_folder",
	localisedFolderName: "ResourceTree_Rooms",
	children: [
		"my-key-folder",
	],
};

export const project: IProject = {
	resources: [
		{
			Key: "my-key-room",
			Value: {
				id: "my-room-id",
				resourcePath: "my_room.json",
				resourceType: GMS2ResourceType.GMRoom,
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
		{
			Key: "my-key-root-folder",
			Value: {
				id: "my-root-folder-id",
				resourcePath: "my_root_folder.json",
				resourceType: GMS2ResourceType.GMFolder,
			},
		},
	],
};
