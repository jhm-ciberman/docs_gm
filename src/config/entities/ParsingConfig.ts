import IParsingConfig from "../interfaces/IParsingConfig";

export default class ParsingConfig implements IParsingConfig {
	/**
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * If true, the arguments with the same name will be merged.
	 * If false, it will be added as different arguments.
	 */
	public mergeDuplicateParams: boolean = false;
}
