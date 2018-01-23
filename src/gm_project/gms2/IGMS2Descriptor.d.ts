/**
 * @fileOverview
 * These interfaces represents all the GameMaker
 * Studio 2 *.json project files.
 */

import GMS2ResourceType from "./GMS2ResourceType";

export interface IProject {
	/**
	 * Map with <Key: resource id, Value: ResourceInfo >
	 */
	resources: IMapItem<IResourceInfo>[];
}

export interface IResourceInfo {
	id: string;
	resourcePath: string;
	resourceType: GMS2ResourceType;
}

export interface IMapItem<T> {
	Key: string;
	Value: T;
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
	IsCompatibility: boolean;
}
