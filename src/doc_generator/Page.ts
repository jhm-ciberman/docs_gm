import * as nunjucks from "nunjucks";
import * as path from "path";
import * as fse from "fs-extra";

import DocProject from "../docs_models/DocProject";
import DocPage from "../docs_models/DocPage";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents one Page for one Design of one Template
 */
export default class Page {


    private _in: string;

    private _out: string;

    private _feedWith: string;

    /**
     * Creates a new TemplatePage
     * @param data The data to populate the Page with
     */
    constructor(data: TemplateJSON.Page) {
        this._in = data.in;
        this._out = data.out;
        this._feedWith = data.feedWith;
    }

    /**
     * Generates all the HTML files corresponding to this TemplatePage
     * @param env The nunjucks Environment object
     * @param docProject the DocProject to generate the pages for
     * @param outFolder The output folder for the HTML files
     * @returns A promise
     */
    public async render(env: nunjucks.Environment, docProject: DocProject, outFolder:string) {
        var template = env.getTemplate(this._in, true);
        var it = this._getFeedPages(docProject);
        for (var feedPage of it) {
            const data = { page: feedPage };
            var str = template.render(data);
            var out = nunjucks.renderString(this._out, data);
            var file = path.resolve(outFolder, out);
            await fse.outputFile(file, str);
        }

    }

    /**
     * Generator function that returns an iterator with each DocPage for the specified project.
     * @param docProject The docProject to get the pages
     */
    private * _getFeedPages(docProject: DocProject): IterableIterator<DocPage> {
        var page: DocPage;
        switch (this._feedWith) {
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
