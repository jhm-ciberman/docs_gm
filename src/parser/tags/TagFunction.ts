import DocScriptFactory from "../DocScriptFactory";
import Tag from "./Tag";

export default class TagFunction extends Tag {

	private _function: string;

	constructor(functionName: string) {
		super();
		this._function = functionName;
	}

	public accept(factory: DocScriptFactory) {
		factory.setFunction(this._function);
	}
}
