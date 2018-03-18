import GMS2ResourceType from "../../../../../src/gm_project/gms2/GMS2ResourceType";
import { IFolder, IProject, IScript } from "../../../../../src/gm_project/gms2/IGMS2Descriptor";

const script: IScript = {
	modelName: GMS2ResourceType.GMScript,
	id: "my-script-id",
	name: "my_script",
	IsCompatibility: false,
	IsDnD: false,
};

const folder: IFolder = {
	modelName: GMS2ResourceType.GMFolder,
	id: "my-folder-id",
	name: "my_folder",
	folderName: "my_folder",
	localisedFolderName: "ResourceTree_Scripts",
	children: [
		"my-key-script",
	],
};

const project: IProject = {
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

const projectFolderScript = {project, folder, script};
export default projectFolderScript;
