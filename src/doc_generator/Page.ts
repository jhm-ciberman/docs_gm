import * as nunjucks from "nunjucks";
import * as path from "path";
import * as fse from "fs-extra";

import Template from "./Template";
import DocProject from "../docs_models/DocProject";
import DocPage from "../docs_models/DocPage";

export default class Page {

    private template:Template;
    private data:TemplateJSONPage;
    private env: nunjucks.Environment;
    constructor(template:Template, data:TemplateJSONPage) {
        this.template = template;
        this.data = data;
        this.env = nunjucks.configure(template.folder, { autoescape: false });
    }

    public async render(docProject:DocProject) {
        var template = this.env.getTemplate(this.data.in, true);
        var it = this._getFeedPages(docProject);
        for (var feedPage of it) {
            const data = {page: feedPage};
            var str = template.render(data);
            var out = nunjucks.renderString(this.data.out, data);
            var file = path.resolve(this.template.config.outFolder, out);
            await fse.outputFile(file, str);
        }

    }

    private * _getFeedPages(docProject:DocProject) {
        var page:DocPage;
        switch (this.data.feedwith) {
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
