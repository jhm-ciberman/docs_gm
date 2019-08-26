import ITagData from "./ITagData";

export default interface ICommentData {
	tags: ITagData[];
	line: number;
	description: string;
	source: string;
}
