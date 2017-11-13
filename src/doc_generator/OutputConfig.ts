export default class OutputConfig {

    /**
     * The design name. The default will use the first design in the designs list.
     */
    public design: string | undefined;

    /**
     * The template name to use
     */
    public templateName: string = "basic";

    /**
     * The glob pattern to use to include files in the project documentation
     */
    public pattern: string = "**/*";

    /**
     * The output folder of the documentation
     */
    public outFolder: string = "./docs/"

    /**
     * The folder where the templates are located
     */
    public templatesFolder: string;

    // TODO: add warning about missing params descriptions

    /**
     * Mark scripts names starting with underscore as private scripts
     */
    public markUnderscoreScriptsAsPrivate: boolean = true; 

    /**
     * Warn about scripts with no documentation
     */
    public warnMissingDocs: boolean = true; 

    /**
     * Ignore private scripts when generating documentation
     */
    public ignorePrivateScripts: boolean = true; 


}
