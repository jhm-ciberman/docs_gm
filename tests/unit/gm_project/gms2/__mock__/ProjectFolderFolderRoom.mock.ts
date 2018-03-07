import GMS2ResourceType from "../../../../../src/gm_project/gms2/GMS2ResourceType";
import { IFolder, IProject, IResource } from "../../../../../src/gm_project/gms2/IGMS2Descriptor";

const room: IResource = {
	modelName: GMS2ResourceType.GMRoom,
	id: "my-room-id",
	name: "my_room",
};

const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "",
	children: [
		"my-key-room",
	],
};

const rootFolder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-root-folder-id",
	name: "my_root_folder",
	folderName: "my_root_folder",
	localisedFolderName: "ResourceTree_Rooms",
	children: [
		"my-key-folder",
	],
};

const project: IProject = {
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

const projectFolderFolderRoom = {project, folder, rootFolder, room};
export default projectFolderFolderRoom;
