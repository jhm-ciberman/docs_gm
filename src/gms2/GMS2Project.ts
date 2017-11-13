import * as fse from "fs-extra";
import * as path from "path";
import * as minimatch from "minimatch";

import GMS2Folder from "./GMS2Folder";
import GMS2Resource from "./GMS2Resource";
import GMS2Model from "./GMS2Model";
import GMS2Script from "./GMS2Script";
import { GMProject, GMProjectStatic } from "../GMInterfaces";
import { staticImplements } from "../_decorators/decorators";

@staticImplements<GMProjectStatic>()
export default class GMS2Project extends GMS2Model implements GMProject {

	public data: GMS2ProjectData;
	public path: string;
	/** key: ResourceID, value: GMS2Resource **/
	private resourcesById: Map<string, GMS2Resource> = new Map();
	/** key: type, value: GMS2Resource[] **/
	public resourcesByType: Map<string, GMS2Resource[]> = new Map();
	private topLevelFolders: Map<string, GMS2Folder> = new Map();

	constructor(data: GMS2ProjectData, GMProjectPath: string) {
		super(data);
		this.path = GMProjectPath;
		this.data = data;
	}

	static async loadProject(file: string) {
		var string = await fse.readFile(file, "utf8");
		return new GMS2Project(JSON.parse(string), path.dirname(file));
	}

	public async load(): Promise<this> {
		await this._loadResources();
		for (var folder of this.topLevelFolders.values()) {
			folder.load();
		}
		return this;
	}

	public find(pattern: string, type: string = ""): GMS2Resource[] {
		var results: GMS2Resource[] = []
		var it = (type === "")
			? this.resourcesById.values()
			: this.resourcesByType.get(type);
		if (it) {
			for (var resource of it) {
				if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
					results.push(resource)
				}
			}
		}
		return results;
	}

	public print(spaces: number = 0) {
		for (var folder of this.topLevelFolders.values()) {
			folder.print(spaces);
		}
	}

	public getResourceFolder(name: string) {
		return this.topLevelFolders.get(name);
	}
	public getResourceById(id: string): GMS2Resource | undefined {
		return this.resourcesById.get(id);
	}
	public addResource(resource: GMS2Resource, type: string) {
		if (this.resourcesByType.has(type)) {
			(this.resourcesByType.get(type) as GMS2Resource[]).push(resource);
		} else {
			this.resourcesByType.set(type, [resource]);
		}
		this.resourcesById.set(resource.id, resource);
	}
	private async _loadResources() {
		if (!this.data) throw "GMProject data is empty";
		for (var resource of this.data.resources) {
			var file = path.resolve(this.path, resource.Value.resourcePath);
			var string = await fse.readFile(file, "utf8");
			var data: GMS2ResourceData = JSON.parse(string);
			var res = this._createFromData(data);
			res.id = resource.Key;
			var type = resource.Value.resourceType.split("GM").join("").toLowerCase();
			this.addResource(res, type);
			if (res instanceof GMS2Folder) {
				this._detectTopLevelFolder(res);
			}

		}
	}

	private _detectTopLevelFolder(folder: GMS2Folder) {
		if (folder.topLevelName !== "") {
			this.topLevelFolders.set(folder.topLevelName, folder);
		}
	}

	private _createFromData(modelData: GMS2ResourceData): GMS2Resource {
		switch (modelData.modelName) {
			case "GMFolder":
				return new GMS2Folder(modelData as GMS2FolderData, this);
			case "GMScript":
				return new GMS2Script(modelData as GMS2ScriptData, this);
			default:
				return new GMS2Resource(modelData, this);
		}
	}

}
