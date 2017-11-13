import * as globby from "globby";
import * as path from "path";
import * as fse from "fs-extra";

import OutputConfig from "./OutputConfig";
import DocProject from "../docs_models/DocProject";
import Page from "./Page";

export default class Template {

    public config: OutputConfig;
    public data: TemplateJSON;
    public folder: string;
    public pages: Page[] = [];
    public copy: string[] = ["**/*", "!template.json", "!*.njk", "!package.json"];
    constructor(config: OutputConfig) {
        this.config = config;
        this.folder = path.resolve(this.config.templatesFolder, this.config.templateName);
    }

    public async load() {
        var template = path.resolve(this.folder, "template.json");
        if (!fse.existsSync(template)) {
            throw `Template ${template} does not exists`;
        }
        var str = await fse.readFile(template, 'utf8');
        this.data = JSON.parse(str);

        var design = this._findDesignByName(this.config.design);

        this.copy = design.copy || this.copy;
        for (var page of design.pages) {
            var p = new Page(this, page);
            this.pages.push(p);
        }
    }


    private _findDesignByName(name?: string): TemplateJSONDesign {
        if (name) {
            var d = this.data.designs.find(value => value.name === name)
            if (!d) throw "Design not found";
            return d;
        } else {
            if (!this.data.designs[0]) {
                throw "Template contains no designs";
            } else {
                return this.data.designs[0];
            }
        }
    }

    public async generateDocs(docProject: DocProject) {
        for (var page of this.pages) {
            await page.render(docProject);
        }
        var outputRoot = path.resolve(this.config.outFolder);
        var files = await globby(this.copy, { cwd: this.folder });
        for (var file of files) {
            var outputFile = path.resolve(outputRoot, file);
            var inputFile = path.resolve(this.folder, file);
            console.log(`COPYING: ${file}`);
            await fse.copy(inputFile, outputFile);
        }

    }


}
