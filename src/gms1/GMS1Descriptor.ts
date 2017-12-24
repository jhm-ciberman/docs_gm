/**
 * @fileOverview
 * These interfaces represents all the
 * GameMaker:Studio 1 *.xml project data.
 */

export interface IRoot {
	Configs: any;
	NewExtensions: any;
	TutorialState: any;
	sounds: [IFolder];
	sprites: [IFolder];
	backgrounds: [IFolder];
	paths: [IFolder];
	scripts: [IFolder];
	fonts: [IFolder];
	objects: [IFolder];
	rooms: [IFolder];
}

export interface IFolder {
	$: { name: string };
	sounds?: IFolder[];
	sound?: string[];
	sprites?: IFolder[];
	sprite?: string[];
	backgrounds?: IFolder[];
	background?: string[];
	paths?: IFolder[];
	path?: string[];
	scripts?: IFolder[];
	script?: string[];
	fonts?: IFolder[];
	font?: string[];
	objects?: IFolder[];
	object?: string[];
	rooms?: IFolder[];
	room?: string[];
}
