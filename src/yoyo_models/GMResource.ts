
import GMModel from "./GMModel";
import GMProject from "./GMProject";
import GMFolder from "./GMFolder";

export default class GMResource extends GMModel {

    public parent: GMFolder|null = null;
    public project: GMProject;
    public name:string;

    constructor(data:GMResourceData, project:GMProject) {
        super(data);
        this.project = project;
        this.name = data.name;
    }

    public print(spaces:number = 0) {
        var sp = "  ".repeat(spaces);
        console.log(`${sp}- ${this.name}`);
	}

    get fullpath():string {
        return (this.parent ? this.parent.fullpath : "/") + this.name;
    }
}
