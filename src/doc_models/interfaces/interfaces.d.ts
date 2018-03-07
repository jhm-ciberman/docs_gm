export interface ISerializedExample {
	code: string | null;
	caption: string | null;
}
export interface ISerializedFolder extends ISerializedResource {
	description: string | null;
	type: string;
	children: ISerializedResource[];
	name: string;
}
export interface ISerializedResource {
	name: string;
	type: string;
	parent: ISerializedFolder | null;
}
export interface ISerializedParam {
	name: string | null;
	type: string | null;
	description: string | null;
	optional: boolean;
}
export interface ISerializedPage {
	project: ISerializedProject;
	script: ISerializedScript | undefined;
	folder: ISerializedFolder | undefined;
	scripts: ISerializedScript[];
}
export interface ISerializedProject {
	name: string;
	scripts: ISerializedFolder;
}
export interface ISerializedScript extends ISerializedResource {
	readonly type: string;
	description: string | null;
	params: ISerializedParam[];
	returns: ISerializedReturns | null;
	return: ISerializedReturns | null;
	examples: ISerializedExample[];
	private: boolean;
	undocumented: boolean;
	function: string;
}
export interface ISerializedReturns {
	type: string | null;
	description: string | null;
}
