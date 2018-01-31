import PageFeedWith from "./PageFeedWith";

/**
 * @fileOverview
 * docs_gm template.json file
 */

export interface IRoot {
	author: string;
	description: string;
	web: string;
	defaultDesign: string;
	designs: IDesignsMap;
}

export interface IDesignsMap {
	[key: string]: IDesign;
}

export interface IDesign {
	displayName: string;
	copy?: string[];
	pages: IPage[];
}

export interface IPage {
	in: string;
	out: string;
	feedWith: PageFeedWith;
}
