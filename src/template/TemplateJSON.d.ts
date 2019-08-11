/**
 * @fileOverview
 * docs_gm template.json file
 */

export interface IRoot {
	author: string;
	description: string;
	web: string;
	name: string;
	copy?: string[];
	pages: IPages;
}

export interface IPages {
	index: string;
	script?: string;
	folder?: string;
	resource?: string;
}