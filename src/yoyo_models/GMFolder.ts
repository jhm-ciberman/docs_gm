
import GMResource from "./GMResource";
import GMProject from "./GMProject";
import minimatch = require("minimatch");


export default class GMFolder extends GMResource {

	public folderName:string;
	private childrenIDs:string[];
	public children:GMResource[] = [];
	public topLevelName:string;
	constructor(data:GMFolderData, project:GMProject) {
		super(data, project);
		this.folderName = data.folderName;
		this.childrenIDs = data.children;
		this.topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
	}


	findChildren() {
		for (var id of this.childrenIDs) {
			var r = this.project.resources.get(id);
			if (r) {
				this.children.push(r);
				r.parent = this;
				if (r instanceof GMFolder) {
					r.findChildren(); //recursive
				}
			}
		}
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
