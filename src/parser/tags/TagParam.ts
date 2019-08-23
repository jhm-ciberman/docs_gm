import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagParam extends Tag {

	constructor(
		private _name: string,
		private _type: string,
		private _optional: boolean,
		private _description: string,
	) {
		super();
	}

	public accept(factory: DocScriptFactory) {
		factory.addParam(this._name, this._type, this._optional, this._description);
	}
}
