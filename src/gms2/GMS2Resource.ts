import GMModel from "./GMS2Model";
import GMProject from "./GMS2Project";
import GMFolder from "./GMS2Folder";
import { GMResource } from "../GMInterfaces";
import DocsGM from "../DocsGM";
import * as GMS2Descriptor from "./GMS2Descriptor";

export default class GMS2Resource extends GMModel implements GMResource {

    public parent: GMFolder | null = null;
    public project: GMProject;
    public name: string;
    public id: string = "";

    
    constructor(data: GMS2Descriptor.Resource, project: GMProject) {
        super(data);
        this.project = project;
        this.name = data.name;
    }

    public print(spaces: number = 0) {
        var sp = "  ".repeat(spaces);
        DocsGM.console.debug(`${sp}- ${this.name}`);
    }

    get fullpath(): string {
        return (this.parent ? this.parent.fullpath : "") + this.name;
    }

    public async load() {
        return this;
    }
}
