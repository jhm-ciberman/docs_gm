import GMS1Project from "./GMS1Project";
import GMS1Resource from "./GMS1Resource";
import GMS1Script from "./GMS1Script";
import DocsGM from "../DocsGM";
import { GMFolder } from "../GMInterfaces";
import * as GMS1Descriptor from "./GMS1Descriptor";


export default class GMS1Folder extends GMS1Resource implements GMFolder {

    public children: GMS1Resource[] = [];

    /**
     * Creates a new Folder Resource
     * @param data The YOYO model data of the folder
     * @param project The base project for the folder
     * @param parent The parent folder for this folder
     */
    constructor(data: GMS1Descriptor.Folder, project: GMS1Project, parent: GMS1Folder | null) {
        super(project, parent, data.$.name);
        this.project = project;
        this.project.addResource(this, "folder");

        for (var folder of data.scripts || []) {
            this.children.push(new GMS1Folder(folder, project, this))
        }
        for (var script of data.script || []) {
            this.children.push(new GMS1Script(script, project, this));
        }

    }

    /**
     * Loads all the resources in the folder
     * @returns A promise
     */
    public async load(): Promise<this> {
        for (var resource of this.children) {
            await resource.load();
        }
        return this;
    }

    /**
     * Print itself to the console for debug purposes
     * @param spaces The number of spaces to use
     */
    public print(spaces: number = 0): void {
        var sp = "  ".repeat(spaces);
        DocsGM.console.debug(`${sp}+ ${this.name}`);
        spaces++;
        for (var child of this.children) {
            child.print(spaces);
        }
    }

}
