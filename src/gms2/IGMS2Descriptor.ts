/**
 * @fileOverview
 * These interfaces represents all the GameMaker
 * Studio 2 *.json project files.
 */

export enum GMS2ResourceType {
	GMScript = "GMScript",
	GMRoom = "GMRoom",
	GMObject = "GMObject",
	GMFolder = "GMFolder",
	GMSprite = "GMSprite",
	GMNotes = "GMNotes",
	GMPath = "GMPath",
	GMShader = "GMShader",
}

export interface IProject {
	id: string;
	resources: [{
		Key: string;
		Value: {
			id: string;
			resourcePath: string;
			resourceType: GMS2ResourceType;
		};
	}];
}

export interface IResource {
	modelName?: GMS2ResourceType;
	id: string;
	name: string;
}

export interface IFolder extends IResource {
	folderName: string;
	localisedFolderName: string;
	children: string[];
}

export interface IScript extends IResource {
	name: string;
	IsDnD?: boolean;
	IsCompatibility?: boolean;
}
