import DocExample from "./DocExample";
import DocParam from "./DocParam";
import DocResource from "./DocResource";
import DocReturns from "./DocReturns";
import { ISerializedScript } from "./interfaces/interfaces";
import ISerializable from "./interfaces/ISerializable";

/**
 * Represents a single script of the GameMaker project.
 */
export default class DocScript extends DocResource implements ISerializable<ISerializedScript> {

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

	public serialize(): ISerializedScript {
		return Object.assign(super.serialize(), {
			type: this.type,
			description: this.description,
			params: this.params.map((p) => p.serialize()),
			return: this.returns ? this.returns.serialize() : null,
			returns: this.returns ? this.returns.serialize() : null,
			examples: this.examples.map((e) => e.serialize()),
			private: this.private,
			undocumented: this.undocumented,
			function: this.function,
		});
	}

}
