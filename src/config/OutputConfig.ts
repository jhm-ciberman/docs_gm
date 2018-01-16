/**
 * This is the configuration related to the process of generating the documentation for a project.
 */
export default class OutputConfig {

	/**
	 * The design name. If empty, it will use the first design in the designs list.
	 */
	public design: string = "";

	/**
	 * The template name to use
	 */
	public template: string = "basic";

	/**
	 * The glob pattern to use to include files in the project documentation
	 */
	public pattern: string = "**/*";

	/**
	 * The output folder of the documentation
	 */
	public outputFolder: string = "./docs/";

	/**
	 * The folder where the templates are located. If empty, the default templates folder will be used
	 */
	public templatesFolder: string = "";
}
