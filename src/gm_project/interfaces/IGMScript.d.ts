import IGMResource from "./IGMResource";

export default interface IGMScript extends IGMResource {
	readonly filepath: string;
	subScripts(): IterableIterator<[string, string]>;
	loadFromString(str: string): void;
}
