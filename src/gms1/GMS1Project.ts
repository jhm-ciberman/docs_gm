import * as xml2js from "xml2js";
import * as path from "path";
import * as fse from "fs-extra";
import * as minimatch from "minimatch";

import { GMProject, GMProjectStatic } from "../GMInterfaces";
import { staticImplements } from "../_decorators/decorators";
import GMS1Folder from "./GMS1Folder";
import GMS1Resource from "./GMS1Resource";

/**
 * Represents a GMS1 Project. The object should be created 
 * ussing the factory static method loadProject.
 */
@staticImplements<GMProjectStatic>()
export default class GMS1Project implements GMProject {

    /**
     * The path of the project
     */
    public path: string;

    private _data: GMS1ProjectData;

    private _topLevelFolders: Map<string, GMS1Folder> = new Map();

    private _resources: GMS1Resource[] = [];

    /** key: type, value: GMS2Resource[] **/
    private _resourcesByType: Map<string, GMS1Resource[]> = new Map();

    /**
     * @private 
     * Creates a new GMS1 Project
     * @param data The data of the GMS1 Project
     * @param GMProjectPath The path of the GMS1 Project
     * 
     */
    private constructor(data: GMS1ProjectData, GMProjectPath: string) {
        this._data = data;
        this.path = GMProjectPath;
    }

    /**
     * Loads the project
     * @return A promise with the current instance for easy chaining
     */
    public async load(): Promise<this> {
        var scriptsFolder = new GMS1Folder(this._data.scripts[0], this, null);
        await scriptsFolder.load();
        this._topLevelFolders.set("scripts", scriptsFolder);
        return this;
    }

    /**
	 * Prints the folder structure of the project in the console for debug
	 * @param spaces Number of spaces to use
	 */
    public print(spaces: number = 0): void {
        for (var folder of this._topLevelFolders.values()) {
            folder.print(spaces);
        }
    }

    /**
	 * Adds a GMS2Resource to the project
	 * @param resource The GMS2Resource to add
	 * @param type The resource type
	 */
    public addResource(resource: GMS1Resource, type: string): void {
        if (this._resourcesByType.has(type)) {
            (this._resourcesByType.get(type) as GMS1Resource[]).push(resource);
        } else {
            this._resourcesByType.set(type, [resource]);
        }
        this._resources.push(resource);
    }

    /**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
    public find(pattern: string, type: string = ""): GMS1Resource[] {
        var results: GMS1Resource[] = []
        var it = (type === "")
            ? this._resources.values()
            : this._resourcesByType.get(type);
        if (it) {
            for (var resource of it) {
                if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
                    results.push(resource)
                }
            }
        }
        return results;
    }


    /**
     * Loads the specified GMS1 project
     * @param file The file path of the project to load
     * @returns A Promise with the GMS1Project
     */
    static async loadProject(file: string): Promise<GMS1Project> {
        var string = await fse.readFile(file, "utf8");
        var data: any = await GMS1Project._xmlParse(string);
        return new GMS1Project(data.assets as GMS1ProjectData, path.dirname(file));
    }

    /**
     * Parses an XML string and returns the data parsed
     * @param string The XML string to parse
     * @return A promise with the data parsed
     */
    private static _xmlParse(string: string): Promise<any> {
        return new Promise(accept => {
            xml2js.parseString(string, (err, result) => {
                if (err) throw err;
                accept(result);
            });
        });
    }


}
