/**
 * @fileOverview
 * These interfaces represents all the
 * GameMaker:Studio 1 *.xml project data.
 */

export interface IGMS1DescriptorRoot {
	assets: IGMS1DescriptorAssets;
}

export interface IGMS1DescriptorAssets {
	Configs?: any;
	NewExtensions?: any;
	TutorialState?: any;
	sounds?: [IGMS1DescriptorFolder];
	sprites?: [IGMS1DescriptorFolder];
	backgrounds?: [IGMS1DescriptorFolder];
	paths?: [IGMS1DescriptorFolder];
	scripts?: [IGMS1DescriptorFolder];
	fonts?: [IGMS1DescriptorFolder];
	objects?: [IGMS1DescriptorFolder];
	rooms?: [IGMS1DescriptorFolder];
}

export interface IGMS1DescriptorFolder {
	$: { 
		name: string 
	};
	sounds?: IGMS1DescriptorFolder[];
	sound?: string[];
	sprites?: IGMS1DescriptorFolder[];
	sprite?: string[];
	backgrounds?: IGMS1DescriptorFolder[];
	background?: string[];
	paths?: IGMS1DescriptorFolder[];
	path?: string[];
	scripts?: IGMS1DescriptorFolder[];
	script?: string[];
	fonts?: IGMS1DescriptorFolder[];
	font?: string[];
	objects?: IGMS1DescriptorFolder[];
	object?: string[];
	rooms?: IGMS1DescriptorFolder[];
	room?: string[];
}
