declare interface GMS2ModelData {
	id:string;
	modelName: string;
	mvc: string;
}

declare interface GMS2ProjectData extends GMS2ModelData {
	resources:[{
		Key: string;
		Value:{
			id:string;
			resourcePath: string;
			resourceType: string;
		};
	}];
}

declare interface GMS2ResourceData extends GMS2ModelData {
	name:string;
}

declare interface GMS2FolderData extends GMS2ResourceData {
	folderName:string;
	localisedFolderName:string;
	children:string[];
}

declare interface GMS2ScriptData extends GMS2ResourceData {
	name: string;
	IsDnD: boolean;
	IsCompatibility: boolean;
}
