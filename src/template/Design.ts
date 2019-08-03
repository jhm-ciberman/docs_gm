import { ITemplate } from "./ITemplate";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents a single design of one Template
 */
export default class Design {

	public static DEFAULT_COPY: string[] = [
		"**/*",
	];

	public static DEFAULT_IGNORE: string[] = [
		"**/template.json",
		"**/*.njk",
		"**/package.json",
		"**/package-lock.json",
		"**/.gitignore",
	];

	/**
	 * The design display name
	 */
	public displayName: string | null;

	/**
	 * An array with the globs used when copying files from the input template folder to the
	 * output documentation folder.
	 */
	public copy: string[] = Design.DEFAULT_COPY;

	/**
	 * The parent template
	 */
	public template: ITemplate;

	/**
	 * The input file for the design
	 */
	public index: string;

	/**
	 * Creates an instance of Design.
	 * @param {Template} template The parent template
	 * @memberof Design
	 */
	public constructor(template: ITemplate, data: TemplateJSON.IDesign) {
		this.template = template;
		this.displayName = data.displayName;
		this.copy = data.copy || this.copy;

		this.index = data.index;
	}

}
