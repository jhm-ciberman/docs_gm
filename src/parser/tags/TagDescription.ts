import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagDescription extends Tag {

	protected _description: string;

	constructor(description: string) {
		super();
		this._description = description;
	}

	public accept(factory: DocScriptFactory) {
		factory.setDescription(this._description);
	}
}
