//// YOYO Specific

declare interface GMModelData {
	id:string;
	modelName: string;
	mvc: string;
}

declare interface GMProjectData extends GMModelData {
	resources:[{
		Key: string;
		Value:{
			id:string;
			resourcePath: string;
			resourceType: string;
		};
	}];
}

declare interface GMResourceData extends GMModelData {
	name:string;
}

declare interface GMFolderData extends GMResourceData {
	folderName:string;
	localisedFolderName:string;
	children:string[];
}

declare interface GMScriptData extends GMResourceData {
	name: string;
	IsDnD: boolean;
	IsCompatibility: boolean;
}


/////////// docs_gm template.json file

declare interface TemplateJSON {
	author: string;
	description: string;
	web: string;
	designs: TemplateJSONDesign[];
}

declare interface TemplateJSONDesign {
	name: string,
	copy: string[],
	pages: TemplateJSONPage[]
}
declare interface  TemplateJSONPage {
    in: string;
	out: string;
	feedwith: string;
}
