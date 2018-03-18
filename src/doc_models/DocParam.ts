/**
 * Represents a single parameter or argument of a script.
 */
export default class DocParam {

	/**
	 * The name of the argument.
	 */
	public name: string = "";

	/**
	 * The type of the argument.
	 */
	public type: string = "";

	/**
	 * The description of the argument
	 */
	public description: string = "";

	/**
	 * `true` or `false` depending if the argument is marked
	 * as optional, or not.
	 */
	public optional: boolean = false;

}
