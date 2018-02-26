import DocExample from "./DocExample";
import DocParam from "./DocParam";
import DocResource from "./DocResource";
import DocReturns from "./DocReturns";

/**
 * Represents a single script of the GameMaker project.
 */
export default class DocScript extends DocResource {

	/**
	 * The resource type
	 */
	public readonly type: string = "script";

	/**
	 * The description of the script
	 */
	public description: string | null = null;

	/**
	 * An array of DocParams objects.
	 * Representing each parameter or argument of the script.
	 */
	public params: DocParam[] = [];

	/**
	 * A DocReturns object, representing the returned value of the script.
	 */
	public returns: DocReturns | null = null;

	/**
	 * A DocReturns object, representing the returned value of the script.
	 * @alias returns
	 */
	get return() {
		return this.returns;
	}

	/**
	 * The Script usage examples
	 */
	public examples: DocExample[] = [];

	/**
	 * Is a private script?
	 */
	public private: boolean = false;

	/**
	 * Is an undocumented script?
	 */
	public undocumented: boolean = true;

	/**
	 * The function name. Normally, is the same as the name.
	 */
	public function: string = "";

}
