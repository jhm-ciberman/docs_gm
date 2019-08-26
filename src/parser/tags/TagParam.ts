import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagParam extends Tag {

	private _name: string;
	private _type: string;
	private _optional: boolean;
	private _description: string;

	constructor(name: string, type: string, optional: boolean, description: string) {
		super();
		this._name = name;
		this._type = type;
		this._optional = optional;
		this._description = description;
	}

	public accept(factory: DocScriptFactory) {
		factory.addParam(this._name, this._type, this._optional, this._description);
	}
}
