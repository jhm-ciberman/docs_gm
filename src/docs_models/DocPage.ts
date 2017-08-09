
import DocScript from "./DocScript";
import DocProject from "./DocProject";

/**
 * The DocPage represents a single page of your Documentation.
 */
export default class DocPage {

    /**
     * The DocProject object representing the GameMaker Project
     * that you are creating the documentation for.
     */
    public project:DocProject;

    /**
     * A DocScript object representing the SINGLE script your must document
     * in the current template page. This is only used in multipage templates.
     * The `script` property is only available when you set the value of
     * `"feedwith": "script"` in your `template.json` file.
     */
    public script:DocScript;


    /**
     * An array of DocScript objects representing ALL the scripts script
     * your must document in the current template page. This is only used
     * in singlepage templates. The `script` property is only available
     * when you set the value of `"feedwith": "scripts"` in your
     * `template.json` file.
     */
    public scripts:DocScript[];

}
