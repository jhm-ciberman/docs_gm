export default class GMS2Model {

    public id: string;
    public modelName: string;
    public mvc: string;
    constructor(data: GMS2ModelData) {
        this.id = data.id;
        this.modelName = data.modelName;
        this.mvc = data.mvc;
    }
}
