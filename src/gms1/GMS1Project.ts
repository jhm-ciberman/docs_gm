import * as xml2js from "xml2js";
import * as path from "path";
import * as fse from "fs-extra";
import * as minimatch from "minimatch";

import { GMProject, GMProjectStatic } from "../GMInterfaces";
import { staticImplements } from "../_decorators/decorators";
import GMS1Folder from "./GMS1Folder";
import GMS1Resource from "./GMS1Resource";

@staticImplements<GMProjectStatic>()
export default class GMS1Project implements GMProject {

    public path: string;
    private _data: GMS1ProjectData;
    private topLevelFolders: Map<string, GMS1Folder> = new Map();

    private resources: GMS1Resource[] = [];
    /** key: type, value: GMS2Resource[] **/
    private resourcesByType: Map<string, GMS1Resource[]> = new Map();
    constructor(data: GMS1ProjectData, GMProjectPath: string) {
        this._data = data;
        this.path = GMProjectPath;
    }

    public async load() {
        var scriptsFolder = new GMS1Folder(this._data.scripts[0], this, null);
        await scriptsFolder.load();
        this.topLevelFolders.set("scripts", scriptsFolder);
        return this;
    }

    public print(spaces: number = 0) {
        for (var folder of this.topLevelFolders.values()) {
            folder.print(spaces);
        }
    }

    static async loadProject(file: string) {
        var string = await fse.readFile(file, "utf8");
        var data: any = await GMS1Project._xmlParse(string);
        return new GMS1Project(data.assets as GMS1ProjectData, path.dirname(file));
    }

    public addResource(resource: GMS1Resource, type: string) {
        if (this.resourcesByType.has(type)) {
            (this.resourcesByType.get(type) as GMS1Resource[]).push(resource);
        } else {
            this.resourcesByType.set(type, [resource]);
        }
        this.resources.push(resource);
    }

    public find(pattern: string, type: string = ""): GMS1Resource[] {
        var results: GMS1Resource[] = []
        var it = (type === "")
            ? this.resources.values()
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

    private static _xmlParse(string: string) {
        return new Promise(accept => {
            xml2js.parseString(string, (err, result) => {
                if (err) throw err;
                accept(result);
            });
        });
    }


}
