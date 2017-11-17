/////////// docs_gm template.json file

export interface Root {
	author: string;
	description: string;
	web: string;
	defaultDesign: string;
	designs: DesignsMap;
}

export interface DesignsMap {
	[key: string]: Design;
}

export interface Design {
	name: string;
	copy?: string[];
	pages: Page[];
}

export interface Page {
	in: string;
	out: string;
	feedWith: string;
}

