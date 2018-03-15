import DocFolder from "./DocFolder";
import { DocElementType } from "./enums/DocElementType";
import IDocElement from "./interfaces/IDocElement";

/**
 * Represents the current GameMaker project that you are documenting.
 */
export default class DocProject implements IDocElement {

	public type: DocElementType = DocElementType.Project;

	/**
	 * The name of the GameMaker project in a readable format.
	 * You can use it for titles, or descriptions inside
	 * your documentation.
	 */
	public name: string = "";

	/**
	 * The root scripts folder
	 */
	public scripts: DocFolder = new DocFolder("scripts");

	/**
	 * Creates an instance of DocProject.
	 * @param {string} name The project name
	 * @memberof DocProject
	 */
	constructor(name: string) {
		this.name = name;
	}
}
