/**
 * This is the configuration related to the process of generating the documentation for a project.
 */
export default interface IOutputConfig {

	/**
	 * The design name. If empty, it will use the first design in the designs list.
	 */
	design: string;

	/**
	 * The template name to use
	 */
	template: string;

	/**
	 * The glob pattern to use to include files in the project documentation
	 */
	pattern: string;

	/**
	 * The output folder of the documentation
	 */
	outputFolder: string;

	/**
	 * The folder where the templates are located. If empty, the default templates folder will be used
	 */
	templatesFolder: string;
}
