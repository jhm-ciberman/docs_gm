import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagReturn extends Tag {

	private _type: string;
	private _description: string;

	constructor(type: string, description: string) {
		super();
		this._type = type;
		this._description = description;
	}

	public accept(factory: DocScriptFactory) {
		factory.setReturns(this._type, this._description);
	}

}
