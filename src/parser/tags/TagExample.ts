import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagExample  extends Tag {

	constructor(private _example: string) {
		super();
	}

	public accept(factory: DocScriptFactory) {
		factory.addExample(this._example);
	}

}
