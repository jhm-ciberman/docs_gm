export default class UnrecognizedTagError extends Error {

	public tagName: string;

	public constructor(tagName: string) {
		super(`Unrecognized tag "@${tagName}"`);
		this.tagName = tagName;
	}
}
