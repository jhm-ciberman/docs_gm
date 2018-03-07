import { ISerializedParam } from "./interfaces/interfaces";
import ISerializable from "./interfaces/ISerializable";

/**
 * Represents a single parameter or argument of a script.
 */
export default class DocParam implements ISerializable<ISerializedParam> {

	/**
	 * The name of the argument.
	 */
	public name: string | null = null;

	/**
	 * The type of the argument.
	 */
	public type: string | null = null;

	/**
	 * The description of the argument
	 */
	public description: string | null = null;

	/**
	 * `true` or `false` depending if the argument is marked
	 * as optional, or not.
	 */
	public optional: boolean = false;

	public serialize(): ISerializedParam {
		return {
			name: this.name,
			type: this.type,
			description: this.description,
			optional: this.optional,
		};
	}

}
