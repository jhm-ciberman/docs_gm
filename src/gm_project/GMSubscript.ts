/**
 * This class represents a subscript
 */
export default class GMSubscript {
	/**
	 * The subscript name
	 */
	public readonly name: string;

	/**
	 * The subscript gml text
	 */
	public readonly text: string;

	/**
	 * Creates an instance of GMSubscript.
	 * @param {string} name The subscript name
	 * @param {string} text The subscript gml text
	 * @memberof GMSubscript
	 */
	constructor(name: string, text: string) {
		this.name = name;
		this.text = text;
	}
}
