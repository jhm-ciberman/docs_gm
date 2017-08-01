import GMProject from "./GMProject";

export default class GMModel {

    public id:string;
    public modelName: string;
    public mvc: string;
    constructor(data:GMModelData) {
        this.id = data.id;
        this.modelName = data.modelName;
        this.mvc = data.mvc;
    }
}
