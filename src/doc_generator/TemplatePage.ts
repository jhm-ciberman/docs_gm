import * as nunjucks from "nunjucks";
import * as path from "path";
import * as fse from "fs-extra";

import Template from "./Template";
import DocProject from "../docs_models/DocProject";
import DocPage from "../docs_models/DocPage";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents one Page for one Design of one Template
 */
export default class TemplatePage {

    private template: Template;

    private data: TemplateJSON.Page;

    private env: nunjucks.Environment;

    /**
     * Creates a new TemplatePage
     * @param template The template to use to generate the Documentation page
     * @param data The data to populate the Page with
     */
    constructor(template: Template, data: TemplateJSON.Page) {
        this.template = template;
        this.data = data;
        this.env = nunjucks.configure(template.folder, { autoescape: false });
    }

    /**
     * Generates all the HTML files corresponding to this TemplatePage
     * @param docProject the DocProject to generate the pages for
     * @param outFolder The output folder for the HTML files
     * @returns A promise
     */
    public async render(docProject: DocProject, outFolder:string) {
        var template = this.env.getTemplate(this.data.in, true);
        var it = this._getFeedPages(docProject);
        for (var feedPage of it) {
            const data = { page: feedPage };
            var str = template.render(data);
            var out = nunjucks.renderString(this.data.out, data);
            var file = path.resolve(outFolder, out);
            await fse.outputFile(file, str);
        }

    }

    private * _getFeedPages(docProject: DocProject) {
        var page: DocPage;
        switch (this.data.feedWith) {
            case "script":
                for (var script of docProject.scripts) {
                    page = new DocPage();
                    page.project = docProject;
                    page.script = script;
                    yield page;
                }
                break;
            case "scripts":
                page = new DocPage();
                page.scripts = docProject.scripts;
                page.project = docProject;
                yield page;
                break;
        }
    }
}
