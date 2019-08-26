import DocScriptFactory from "../DocScriptFactory";
import UnrecognizedTagError from "../UnrecognizedTagError";
import Tag from "./Tag";

export default class TagUnknown extends Tag {

	constructor(public tagName: string) {
		super();
	}

	public accept(_factory: DocScriptFactory) {
		throw new UnrecognizedTagError(this.tagName);
	}
}
