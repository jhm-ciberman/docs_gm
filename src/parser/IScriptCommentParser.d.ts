import Tag from "./tags/Tag";

export default interface IScriptCommentParser {
	parse(text: string): Tag[];
}