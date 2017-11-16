// GameMaker Studio 2 *.json project 

export interface Model {
	id: string;
	modelName: string;
	mvc: string;
}

export interface Project extends Model {
	resources: [{
		Key: string;
		Value: {
			id: string;
			resourcePath: string;
			resourceType: string;
		};
	}];
}

export interface Resource extends Model {
	name: string;
}

export interface Folder extends Resource {
	folderName: string;
	localisedFolderName: string;
	children: string[];
}

export interface Script extends Resource {
	name: string;
	IsDnD: boolean;
	IsCompatibility: boolean;
}
