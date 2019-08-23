import DocScriptFactory from "../DocScriptFactory";

export default abstract class Tag {
	public abstract accept(factory: DocScriptFactory): void;
}
