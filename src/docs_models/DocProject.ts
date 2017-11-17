
import DocScript from "./DocScript";

/**
 * Represents the current GameMaker project that you are documenting.
 */
export default class DocProject {

	/**
	 * The name of the GameMaker project in a readable format.
	 * You can use it for titles, or descriptions inside
	 * your documentation.
	 */
	public name: string = "";

	/**
	 * An array of ALL the scripts of the project included in
	 * the documentation.
	 * WARNING:Normally you DON'T want
	 * to use this array, since this represents ALL the scripts
	 * in your **Project**, not the script or scripts you want
	 * to include in your **Page**. You must use the values
	 * of DocPage insted.
	 */
	public scripts: DocScript[] = [];

}
