import * as globby from "globby";
import * as path from "path";
import * as fse from "fs-extra";

import OutputConfig from "./OutputConfig";
import DocProject from "../docs_models/DocProject";
import Page from "./TemplatePage";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

    /**
     * The output configuration object
     */
    //public config: OutputConfig;

    /**
     * The TemplateJSON data
     */
    public data: TemplateJSON;

    /**
     * The folder of the template
     */
    public folder: string;

    /**
     * An array with the pages of the template
     */
    public pages: Page[] = [];

    /**
     * An array with the globs ussed when copying files from the input template folder to the
     * output documentation folder.
     */
    public copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];

    /**
     * Creates a new Template object
     * @param folder the folder that contains the template
     */
    constructor(folder: string) {
        this.folder = folder;
    }

    /**
     * Loads the template
     * @returns A promise
     */
    public async load() {
        var template = path.resolve(this.folder, "template.json");
        if (!fse.existsSync(template)) {
            throw `Template ${template} does not exists`;
        }
        var str = await fse.readFile(template, 'utf8');
        this.data = JSON.parse(str);

        
    }

    /**
     * Find a Design by name. If no design name is specified, }
     * the first design will be returned.
     * @param name The optional name of the design
     * @returns The JSON Design data object
     */
    private _findDesignByName(name?: string): TemplateJSONDesign {
        if (this.data.designs.length === 0) {
            throw "Template contains no designs";
        }
        if (name) {
            var d = this.data.designs.find(value => value.name === name)
            if (!d) throw "Design not found";
            return d;
        } else {
            return this.data.designs[0];
        }
    }

    /**
     * Generates the documentation for the specified project. The DocProject
     * must be already loaded.
     * @param docProject The DocProject to generate the documentation for
     * @param config The configuration to use
     */
    public async generateDocs(docProject: DocProject, config: OutputConfig) {
        var outputRoot = path.resolve(config.outFolder);

        var design = this._findDesignByName(config.design);

        this.copy = design.copy || this.copy;
        for (var page of design.pages) {
            var p = new Page(this, page);
            await p.render(docProject, outputRoot);
        }

        
        var files = await globby(this.copy, { cwd: this.folder });
        for (var file of files) {
            var outputFile = path.resolve(outputRoot, file);
            var inputFile = path.resolve(this.folder, file);
            console.log(`COPYING: ${file}`);
            await fse.copy(inputFile, outputFile);
        }

    }


}
