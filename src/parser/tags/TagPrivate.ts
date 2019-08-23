import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagPrivate extends Tag {

	constructor(private _description: string) {
		super();
	}

	public accept(factory: DocScriptFactory) {
		factory.setDescription(this._description);
		factory.markPrivate();
	}
}
