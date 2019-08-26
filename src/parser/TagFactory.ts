import ITagData from "./ITagData";
import Tag from "./tags/Tag";
import TagDescription from "./tags/TagDescription";
import TagExample from "./tags/TagExample";
import TagFunction from "./tags/TagFunction";
import TagParam from "./tags/TagParam";
import TagPrivate from "./tags/TagPrivate";
import TagReturn from "./tags/TagReturn";
import TagUnknown from "./tags/TagUnknown";

export default class TagFactory {
	private static _functionMap: Map<string, (tag: ITagData) => Tag> = new Map();

	constructor() {
		TagFactory._functionMap.set("param", this._param.bind(this));
		TagFactory._functionMap.set("arg", this._param.bind(this));
		TagFactory._functionMap.set("argument", this._param.bind(this));
		TagFactory._functionMap.set("description", this._description.bind(this));
		TagFactory._functionMap.set("desc", this._description.bind(this));
		TagFactory._functionMap.set("private", this._private.bind(this));
		TagFactory._functionMap.set("returns", this._return.bind(this));
		TagFactory._functionMap.set("return", this._return.bind(this));
		TagFactory._functionMap.set("example", this._example.bind(this));
		TagFactory._functionMap.set("function", this._function.bind(this));
		TagFactory._functionMap.set("func", this._function.bind(this));
		TagFactory._functionMap.set("method", this._function.bind(this));
	}

	public createTag(tagData: ITagData): Tag {
		const factoryFunction = TagFactory._functionMap.get(tagData.tag.toLowerCase());
		if (factoryFunction) {
			return factoryFunction(tagData);
		} else {
			return new TagUnknown(tagData.tag);
		}
	}

	private _return(tag: ITagData) {
		return new TagReturn(tag.type, [tag.name, tag.description].join(" "));
	}

	private _param(tag: ITagData) {
		return new TagParam(tag.name, tag.type, tag.optional, tag.description);
	}

	private _description(tag: ITagData) {
		return new TagDescription(this._reconstructTag(tag));
	}

	private _private(tag: ITagData) {
		return new TagPrivate(this._reconstructTag(tag));
	}

	private _example(tag: ITagData) {
		return new TagExample(this._reconstructTag(tag));
	}

	private _function(tag: ITagData) {
		return new TagFunction(this._parseFunction(this._reconstructTag(tag)));
	}

	/**
	 * Given a function tag like "my_function(a,b,c)" produces "my_function"
	 * @param str The original function tag string
	 */
	private _parseFunction(str: string): string {
		const r = /^(.*)\(/.exec(str);
		return (r && r.length > 0) ? r[1] : str;
	}

	/**
	 * Recreates the content of a splitted tag into a single string.
	 * For example, in a description tag, if you start your description
	 * with {} or with [], then the CommentParser will treat those brackets
	 * like an optional argument. This script, recreates the original description
	 * tag.
	 * @param tag The tag to reconstruct
	 */
	private _reconstructTag(tag: ITagData): string {
		// TODO: reconstruct tag from tag.source.
		const strArr = [];
		if (tag.type) {
			strArr.push(`{${tag.type}}`);
		}
		if (tag.name) {
			strArr.push((tag.optional) ? "[" + tag.name + "]" : tag.name);
		}
		if (tag.description) {
			strArr.push(tag.description);
		}
		return strArr.join(" ");
	}
}
