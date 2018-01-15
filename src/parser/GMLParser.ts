
export interface IGMLFeatures {
	/**
	 * Number of arguments
	 */
	argumentCount: number;
	/**
	 * Has optional arguments? (argument[i])
	 */
	optionalArguments: boolean;
	/**
	 * Has a return statement?
	 */
	hasReturn: boolean;
}

/**
 * Static class for parse GML code and
 * extract features (number of arguments, optional arguments, returns statments, etc)
 */
export default class GMLParser {

	/**
	 * Parses a GML code and returns a GMLFeatures object with the features of that GML code
	 * @param text The GML code to parse
	 * @return a GMLFeatures object
	 */
	public static extractGMLFeatures(text: string): IGMLFeatures {
		// Removes single and multiline comments.
		// See: https://stackoverflow.com/a/15123777/2022985
		text = text.replace(this._removeCommentsRegex, "$1");

		// Removes strings (Double and single quoted strings)
		// See: https://stackoverflow.com/a/17231632/2022985
		text = text.replace(this._removeStringsRegex, "");

		const data: IGMLFeatures = {
			argumentCount: 0,
			optionalArguments: false,
			hasReturn: false,
		};

		let result: RegExpExecArray | null;
		// Match: argument0, argument1, argument2... etc.
		result = this._findFixedArgumentsRegex.exec(text);
		while (result) {
			data.argumentCount = Math.max(data.argumentCount, parseInt(result[1], 10) + 1);
			result = this._findFixedArgumentsRegex.exec(text);
		}

		// March argument[0], argument[1], argument[2]... etc
		result = this._findArrayArgumentsRegex.exec(text);
		while (result) {
			data.argumentCount = Math.max(data.argumentCount, parseInt(result[1], 10) + 1);
			data.optionalArguments = true;
			result = this._findArrayArgumentsRegex.exec(text);
		}

		// Match return statements
		data.hasReturn = (text.match(this._findReturnRegex) !== null);

		return data;
	}

	/**
	 * regex to remove the comments from the gml
	 */
	private static _removeCommentsRegex: RegExp = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

	/**
	 * Regex to remove the strings from the gml
	 */
	private static _removeStringsRegex: RegExp = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/;

	/**
	 * Regex to find arguments0..argument1..etc
	 */
	private static _findFixedArgumentsRegex: RegExp = /[\s{(]argument([0-9]+)[\s;})]/g;

	/**
	 * Regex to find optional arguments. arguments[0]..argument[1]..etc
	 */
	private static _findArrayArgumentsRegex: RegExp = /[\s{(]argument\[([0-9]+)\][\s;})]/g;

	/**
	 * Regex to find return statements
	 */
	private static _findReturnRegex: RegExp = /[\s{(;]return[\s;})]/;

}
