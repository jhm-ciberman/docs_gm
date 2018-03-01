import { injectable } from "inversify";
import IGMLParser from "./interfaces/IGMLParser";

/**
 * Class for parsing GML code and
 * extract features (number of arguments, optional arguments, returns statements, etc)
 */
@injectable()
export default class GMLParser implements IGMLParser {

	/**
	 * The GML code as a string
	 */
	private _text: string;

	/**
	 * Regex to find arguments0..argument1..etc
	 */
	private _findFixedArgumentsRegex: RegExp = /\bargument([0-9]+)\b/gm;

	/**
	 * Regex to find optional arguments. arguments[0]..argument[1]..etc
	 */
	private _findOptionalArgumentsRegex: RegExp = /\bargument\[([0-9]+)\]\B/gm;

	/**
	 * Regex to find return statements
	 */
	private _findReturnRegex: RegExp = /\breturn\b/gm;

	/**
	 * Creates a new GMLParser
	 * @param text The gml text to parse
	 */
	constructor(text: string) {
		// Removes single and multiline comments.
		// See: https://stackoverflow.com/a/15123777/2022985
		text = text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");

		// Removes strings (Double and single quoted strings)
		// See: https://stackoverflow.com/a/17231632/2022985
		text = text.replace(/(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/, "");

		this._text = text;
	}

	/**
	 * Counts the number of fixed arguments
	 */
	public countFixedArguments(): number {
		return this._countArgs(this._findFixedArgumentsRegex);
	}

	/**
	 * Counts the number of optional arguments
	 */
	public countOptionalArguments(): number {
		return this._countArgs(this._findOptionalArgumentsRegex);
	}

	/**
	 * Check if the GML code has a return statement.
	 */
	public hasReturn(): boolean {
		return (this._text.match(this._findReturnRegex) !== null);
	}

	/**
	 * Helper function used to count the number of arguments of the gml script.
	 * @param regex The regex to use
	 * @returns The number of arguments
	 */
	private _countArgs(regex: RegExp): number {
		let count = 0;
		let result = regex.exec(this._text);
		while (result) {
			count = Math.max(count, parseInt(result[1], 10) + 1);
			result = regex.exec(this._text);
		}
		return count;
	}

}
