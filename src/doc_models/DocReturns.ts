import { ISerializedReturns } from "./interfaces/interfaces";
import ISerializable from "./interfaces/ISerializable";

/**
 * Represents a returned value of a script.
 */
export default class DocReturns implements ISerializable<ISerializedReturns> {

	/**
	 * The type of the returned value.
	 */
	public type: string | null = null;

	/**
	 * The description of the returned value
	 */
	public description: string | null = null;

	public serialize(): ISerializedReturns {
		return {
			type: this.type,
			description: this.description,
		};
	}
}
