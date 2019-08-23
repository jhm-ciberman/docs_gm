import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagReturn extends Tag {

	constructor(private _type: string, private _description: string) {
		super();
	}

	public accept(factory: DocScriptFactory) {
		factory.setReturns(this._type, this._description);
	}

}
