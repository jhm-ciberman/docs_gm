import GMS1Project from "./GMS1Project";
import GMS1Folder from "./GMS1Folder";

export default class GMS1Resource {
    public project: GMS1Project;
    public parent: GMS1Folder|null;
    public name:string;
    constructor(project:GMS1Project, parent:GMS1Folder|null, name:string) {
        this.project = project;
        this.parent = parent;
        this.name = name;
    }

    public async load() {
        // empty! :D (see subclasses)
        return this;
    }

    get fullpath():string {
        return (this.parent ? this.parent.fullpath : "") + this.name;
    }

    public print(spaces:number = 0) {
        var sp = "  ".repeat(spaces);
        console.log(`${sp}- ${this.name}`);
    }
}
