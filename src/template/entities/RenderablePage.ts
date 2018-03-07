
/**
 * This class represents an HTML page that will be rendered.
 */
export default class RenderablePage {
	/**
	 * The relative input file name of the template file
	 */
	public inputFile: string;

	/**
	 * The output file path, relative to the root of the output folder
	 */
	public outputFile: string;

	/**
	 * The encoded data that needs to be passed to the templating engine
	 */
	public encodedData: any;
}
