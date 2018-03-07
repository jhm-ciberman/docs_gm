import { ISerializedExample } from "./interfaces/interfaces";
import ISerializable from "./interfaces/ISerializable";

/**
 * Represents an example code
 */
export default class DocExample implements ISerializable<ISerializedExample> {

	/**
	 * The escaped code of the example
	 */
	public code: string | null = null;

	/**
	 * The caption of the code
	 */
	public caption: string | null = null;

	public serialize(): ISerializedExample {
		return {
			code: this.code,
			caption: this.caption,
		};
	}
}
