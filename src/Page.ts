
import nunjucks = require("nunjucks");
import minimatch = require("minimatch");
import path = require("path");
import fse = require("fs-extra");
import Template from "./Template";
import DocProject from "./docs_models/DocProject";
import DocPage from "./docs_models/DocPage";

export default class Page {

    private template:Template;
    private data:TemplateJSONPage;
    private nunjucksTemplate: nunjucks.Template;
    constructor(template:Template, data:TemplateJSONPage) {
        this.template = template;
        this.data = data;
    }

    public async load() {
        var file = path.resolve(this.template.folder, this.data.in);
        var str = await fse.readFile(file, 'utf8');
        this.nunjucksTemplate = nunjucks.compile(str);

    }

    public async render(docProject:DocProject) {
        var it = this._getFeedPages(docProject);
        for (var feedPage of it) {
            var str = this.nunjucksTemplate.render(feedPage);
            var out = nunjucks.renderString(this.data.out, feedPage);
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
                    page.script = script;
                    yield page;
                }
                break;
            case "scripts":
                page = new DocPage();
                page.scripts = docProject.scripts;
                yield page;
                break;
        }
    }
}
