import { ITemplate } from "./interfaces/ITemplate";
import * as TemplateJSON from "./interfaces/TemplateJSON";

/**
 * Represents a single design of one Template
 */
export default class Design {

	/**
	 * The design display name
	 */
	public displayName: string | null;

	/**
	 * An array with the globs used when copying files from the input template folder to the
	 * output documentation folder.
	 */
	public copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

	/**
	 * The parent template
	 */
	public template: ITemplate;

	/**
	 * The input file for the index file
	 */
	public index: string;
	/**
	 * The input file for the script files
	 */
	public script: string = "";
	/**
	 * The input file for the folders
	 */
	public folder: string = "";
	/**
	 * The input file for the other resources
	 */
	public resource: string = "";

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
		this.script = data.script || this.script;
		this.folder = data.folder || this.folder;
		this.resource = data.resource || this.resource;
	}

}
