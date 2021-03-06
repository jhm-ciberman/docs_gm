import DocExample from "./DocExample";
import DocParam from "./DocParam";
import DocResource from "./DocResource";
import { DocResourceType } from "./DocResourceType";
import DocReturns from "./DocReturns";

/**
 * Represents a single script of the GameMaker project.
 */
export default class DocScript extends DocResource {

	/**
	 * The resource type
	 */
	public readonly type: DocResourceType = DocResourceType.Script;

	/**
	 * The description of the script
	 */
	public description: string = "";

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

	/**
	 * Returns the full script(a,b,c) signature.
	 */
	public get signature(): string {
		const paramNames = this.params
				.map((param) => param.optional ? `[${ param.name }]` : param.name);

		return this.name + "(" + paramNames.join(", ") + ");";
	}

}
