
import DocFolder from "./DocFolder";
import DocProject from "./DocProject";
import DocScript from "./DocScript";

/**
 * The DocPage represents a single page of your Documentation.
 */
export default class DocPage {

	/**
	 * The DocProject object representing the GameMaker Project
	 * that you are creating the documentation for.
	 */
	public project: DocProject;

	/**
	 * A DocScript object representing the CURRENT script your must document
	 * in the current template page. This is only used in multipage templates.
	 * The `script` property is only available when you set the value of
	 * `"feedwith": "script"` in your `template.json` file.
	 */
	public script: DocScript;

	/**
	 * A DocFolder object representing the CURRENT folder your must document
	 * in the current template page. This is only used in multipage templates.
	 * The `folder` property is only available when you set the value of
	 * `"feedwith": "folder"` in your `template.json` file.
	 */
	public folder: DocFolder;

	/**
	 * An array of DocScript objects representing ALL the scripts in the project documentation.
	 */
	public scripts: DocScript[];

	/**
	 * An array of DocModule objects representing ALL the **ROOT** modules in the project documentation
	 */
	public folders: DocScript[];

}
