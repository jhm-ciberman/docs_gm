import GMS2Resource from "./GMS2Resource";
import GMS2Project from "./GMS2Project";
import {GMFolder} from "../GMInterfaces";

export default class GMS2Folder extends GMS2Resource implements GMFolder {

	public folderName:string;
	private childrenIDs:string[];
	public children:GMS2Resource[] = [];
	public topLevelName:string;
	constructor(data:GMS2FolderData, project:GMS2Project) {
		super(data, project);
		this.folderName = data.folderName;
		this.childrenIDs = data.children;
		this.topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}


	public async load() {
		for (var id of this.childrenIDs) {
			var r = this.project.getResourceById(id);
			if (r) {
				this.children.push(r);
				r.parent = this;
				if (r instanceof GMS2Folder) {
					r.load(); //recursive
				}
			}
		}
		return this;
	}

	public print(spaces:number = 0) {
		var sp = "  ".repeat(spaces);
        console.log(`${sp}+ ${this.folderName}`);
		spaces++;
		for (var child of this.children) {
			child.print(spaces);
		}
	}

	get fullpath():string {
        return (this.parent ? this.parent.fullpath : "/") + this.folderName + "/";
    }

};
