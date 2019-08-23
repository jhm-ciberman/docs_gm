import parse = require("comment-parser");
import { injectable } from "inversify";
import ICommentData from "./ICommentData";
import IScriptCommentParser from "./IScriptCommentParser";
import TagFactory from "./TagFactory";
import Tag from "./tags/Tag";
import TagDescription from "./tags/TagDescription";

@injectable()
export default class ScriptCommentParser implements IScriptCommentParser {

	private _tagFactory: TagFactory;

	constructor() {
		this._tagFactory = new TagFactory();
	}

	public parse(text: string): Tag[] {
		const comments = parse(text) as ICommentData[];

		if (comments.length === 0) { return []; }

		const tags = this._getAllTags(comments);
		const description = this._getDescription(comments);

		if (description) {
			tags.push(new TagDescription(description));
		}

		return tags;
	}

	private _getDescription(comments: ICommentData[]) {
		return comments[comments.length - 1].description;
	}

	private _getAllTags(comments: ICommentData[]): Tag[] {
		const tagDataArray = comments
			.map((comment) => comment.tags)
			.reduce((acc, tagsArray) => acc.concat(tagsArray), []);

		const tags = [];
		for (const tagData of tagDataArray) {
			const tagObject = this._tagFactory.createTag(tagData);
			if (tagObject) {
				tags.push(tagObject);
			}
		}

		return tags;
	}
}
