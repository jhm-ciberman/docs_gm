import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagFunction extends Tag {

	constructor(private _function: string) {
		super();
	}

	public accept(factory: DocScriptFactory) {
		factory.setFunction(this._function);
	}
}
