import PageFeedWith from "../enums/PageFeedWith";

/**
 * Represents one Page for one Design of one Template
 */
export default class Page {

	/**
	 * The input file of the page
	 */
	public readonly in: string;

	/**
	 * The output file of the page. Can be a templating string.
	 * Will be parsed by nunjuncks
	 */
	public readonly out: string;

	/**
	 * Possible values are "script"
	 */
	public readonly feedWith: PageFeedWith;

	/**
	 * Creates a new TemplatePage
	 */
	constructor(input: string, output: string, feedWith: PageFeedWith) {
		this.in = input;
		this.out = output;
		this.feedWith = feedWith;
	}

}
