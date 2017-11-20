// GameMaker Studio 2 *.json project

export interface IModel {
	id: string;
	modelName: string;
	mvc: string;
}

export interface IProject extends IModel {
	resources: [{
		Key: string;
		Value: {
			id: string;
			resourcePath: string;
			resourceType: string;
		};
	}];
}

export interface IResource extends IModel {
	name: string;
}

export interface IFolder extends IResource {
	folderName: string;
	localisedFolderName: string;
	children: string[];
}

export interface IScript extends IResource {
	name: string;
	IsDnD: boolean;
	IsCompatibility: boolean;
}
