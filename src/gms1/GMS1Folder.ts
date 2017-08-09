import GMS1Project from "./GMS1Project";
import GMS1Resource from "./GMS1Resource";
import GMS1Script from "./GMS1Script";
import {GMFolder} from "../GMInterfaces";

export default class GMS1Folder extends GMS1Resource implements GMFolder {



    public children:GMS1Resource[] = [];
    constructor(data:GMS1FolderData, project:GMS1Project, parent:GMS1Folder|null) {
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

    public async load() {
        for (var resource of this.children) {
            await resource.load();
        }
        return this;
    }

    public print(spaces:number = 0) {
        var sp = "  ".repeat(spaces);
        console.log(`${sp}+ ${this.name}`);
        spaces++;
        for (var child of this.children) {
            child.print(spaces);
        }
    }

}
