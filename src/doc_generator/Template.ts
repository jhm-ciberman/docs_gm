
import * as path from "path";
import * as fse from "fs-extra";

import OutputConfig from "./OutputConfig";
import DocProject from "../docs_models/DocProject";
import * as TemplateJSON from "./templateJSON";
import Design from "./Design";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

    /**
     * The folder of the template
     */
    public folder: string;

    /**
     * A map containing with the designs. Each key is the name of the design.
     */
    private _designs: Map<string, Design> = new Map();

    /**
     * The template author
     */
    public author: string; 
    
    /**
     * The default design name
     */
    public defaultDesign: Design | undefined; 
    
    /**
     * The default design name
     */
    public description: string; 
    
    /**
     * The web of the author of the template
     */
    public web: string; 

    /**
     * Creates a new Template object
     * @param folder the folder that contains the template
     */
    constructor(data: TemplateJSON.Root, folder: string) {

        for (var name in data.designs) {
            var design = new Design(this, data.designs[name]);
            this._designs.set(name, design);
        }

        this.defaultDesign = this._designs.get(data.defaultDesign);
        if (!this.defaultDesign) {
            throw "Default design name is invalid";
        }

        this.folder = path.resolve(folder);
        this.author = data.author;
        this.description = data.description;
        this.web = data.web;
    }

    /**
     * Loads the template
     * @returns A promise
     */
    public static async loadFrom(folder: string): Promise<Template> {
        var template = path.resolve(folder, "template.json");
        if (!fse.existsSync(template)) {
            throw `Template ${template} does not exists`;
        }
        var str = await fse.readFile(template, 'utf8');
        var data = JSON.parse(str);

        return new Template(data, folder);
    }

    /**
     * Generates the documentation for the specified project. The DocProject
     * must be already loaded.
     * @param docProject The DocProject to generate the documentation for
     * @param config The configuration to use
     */
    public async generateDocs(docProject: DocProject, config: OutputConfig) {
        if (this._designs.size === 0) {
            throw "Template contains no designs";
        }
        
        var design = this._designs.get(config.design) || this.defaultDesign;
        if (!design) {
            throw `Design was not found`; 
        }

        var out = path.resolve(config.out);
        design.render(out, docProject);

    }


}
