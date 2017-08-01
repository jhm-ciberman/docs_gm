
import GMFolder from "./GMFolder";
import GMScript from "./GMScript";
import fse = require("fs-extra");
import path = require("path");
import GMResource from "./GMResource";
import GMModel from "./GMModel";
import minimatch = require("minimatch");
import DocsGenerator from "./../Documentation";

export default class GMProject extends GMModel {

	public data:GMProjectData;
	public path:string;
	public resources:Map<string, GMResource> = new Map();
	private topLevelFolders:Map<string, GMFolder> = new Map();
	public resourcesByType:Map<string, GMResource[]> = new Map();

	constructor(data:GMProjectData, GMProjectPath:string) {
		super(data);
		this.path = GMProjectPath;
		this.data = data;
	}

	public async loadResourceTree() {
		await this._loadResources();
		for (var folder of this.topLevelFolders.values()) {
			folder.findChildren();
		}
		return this;
	}

	public find(pattern:string, type:string = ""):GMResource[] {
		var results:GMResource[] = []
		var it = (type === "") ? this.resources.values() : this.resourcesByType.get(type);
		if (it) {
			for (var resource of it) {
				if (minimatch(resource.fullpath, pattern, {matchBase:true})) {
					results.push(resource)
				}
			}
		}
		return results;
	}

	public print(spaces:number = 0) {
		for (var folder of this.topLevelFolders.values()) {
			folder.print(spaces);
		}
	}

	public getResourceFolder(name:string) {
		return this.topLevelFolders.get(name);
	}

	private async _loadResources() {
		if (!this.data) throw "GMProject data is empty";
		for (var resource of this.data.resources) {
			var file = path.resolve(this.path, resource.Value.resourcePath);
			var string = await fse.readFile(file, "utf8");
			var data:GMResourceData = JSON.parse(string);
			var res = this._createResource(data);
			this.resources.set(resource.Key, res);
			var type = resource.Value.resourceType;
			if (!this.resourcesByType.has(type)) {
				this.resourcesByType.set(type, [res]);
			} else {
				(this.resourcesByType.get(type) as GMResource[]).push(res);
			}
			if (res instanceof GMFolder) {
				this._detectTopLevelFolder(res);
			}

		}
	}

	private _createResource(modelData:GMResourceData):GMResource {
		switch (modelData.modelName) {
			case "GMFolder":
				return new GMFolder(modelData as GMFolderData, this);
			case "GMScript":
				return new GMScript(modelData as GMScriptData, this);
			default:
				return new GMResource(modelData, this);
		}
	}

	private _detectTopLevelFolder(folder:GMFolder) {
		if (folder.topLevelName !== "") {
			this.topLevelFolders.set(folder.topLevelName, folder);
		}
	}

}
