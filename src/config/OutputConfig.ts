import IOutputConfig from "./interfaces/IOutputConfig";

/**
 * This class has all the configuration for the DocsGM Output
 */
export default class OutputConfig implements IOutputConfig {
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
