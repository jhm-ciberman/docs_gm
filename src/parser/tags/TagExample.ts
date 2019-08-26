import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagExample  extends Tag {

	private _example: string;

	constructor(example: string) {
		super();
		this._example = example;
	}

	public accept(factory: DocScriptFactory) {
		factory.addExample(this._example);
	}

}
