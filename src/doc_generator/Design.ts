import Page from "./Page";
import * as TemplateJSON from "./templateJSON";
import * as nunjucks from "nunjucks";
import DocProject from "../docs_models/DocProject";
import * as globby from "globby";
import Template from "./Template";
import DocsGM from "../DocsGM";
import * as path from "path";
import * as fse from "fs-extra";

/**
 * Represents a single design of one Template
 */
export default class Design {

    /**
     * An array with the globs ussed when copying files from the input template folder to the
     * output documentation folder.
     */
    public _copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

    /**
     * An array with the pages of the template
     */
    public _pages: Page[] = [];

    /**
     * The template to which this Design belongs
     */
    private _template:Template; 

    /**
     * Creates a new Design Object
     * @param template TThe template to which this design belongs
     * @param data The data to populate over this design
     */
    constructor(template:Template, data: TemplateJSON.Design) {
        this._copy = data.copy || this._copy;
        for (var page of data.pages) {
            this._pages.push(new Page(page)); 
        }
        this._template = template;
    }

    /**
     * Renders the documentation for the specified docProject and place the HTML files and the 
     * other files inside the outputFolder. 
     * @param outputFolder The output folder
     * @param docProject The docProject to render the documentation
     */
    public async render(outputFolder: string, docProject: DocProject) {
        var env = nunjucks.configure(this._template.folder, { autoescape: false }); 

        for (var page of this._pages) {
            await page.render(env, docProject, outputFolder);
        }      
        
        var files = await globby(this._copy, { cwd: this._template.folder });

        for (var file of files) {
            var outputFile = path.resolve(outputFolder, file);
            var inputFile = path.resolve(this._template.folder, file);
            DocsGM.console.info(`COPYING: ${file}`);
            await fse.copy(inputFile, outputFile);
        }
    }
}