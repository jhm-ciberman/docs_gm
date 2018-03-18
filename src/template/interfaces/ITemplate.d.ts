import Design from "../Design";

export interface ITemplate {
	/**
	 * The folder of the template
	 */
	folder: string;

	/**
	 * The template author
	 */
	author: string | undefined;

	/**
	 * The default design name
	 */
	defaultDesign: Design;

	/**
	 * The default design name
	 */
	description: string | undefined;

	/**
	 * The web of the author of the template
	 */
	web: string | undefined;

	/**
	 * Finds a design by name. Returns the default design if not found
	 * @param design The design name.
	 */
	getDesign(design: string): Design | undefined;

	/**
	 * Returns if the design exists in the template
	 * @param design The design name
	 */
	hasDesign(design: string): boolean;

	/**
	 * Iterator function to get all the designs of the template
	 */
	designs(): IterableIterator<Design>;

	/**
	 * Tries to return an specific design if specified, or the default design if a empty string is passed
	 * @param designName The design name. If empty, the default design will be returned
	 */
	findDesign(designName: string): Design;
}