import DocScriptFactory from "../DocScriptFactory";
import TagDescription from "./TagDescription";

export default class TagPrivate extends TagDescription {

	public accept(factory: DocScriptFactory) {
		factory.setDescription(this._description);
		factory.markPrivate();
	}
}
