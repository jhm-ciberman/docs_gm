import DocScript from "./docs_models/DocScript";

export interface GMProject {
    path:string;
    load():Promise<this>;
    print(spaces?:number):void;
    find(pattern:string, type?:string):GMResource[];
    addResource(resource:GMResource, type:string):void;
}

export interface GMProjectStatic {
    //new():GMProject;
    loadProject(file:string):Promise<GMProject>
}

export interface GMResource {
    project:GMProject;
    parent:GMFolder|null;
    fullpath:string;
    name:string;
    print(spaces?:number):void;
    load():Promise<this>;
}

export interface GMFolder extends GMResource {

}

export interface GMScript extends GMResource {
    parse():DocScript[];
}
