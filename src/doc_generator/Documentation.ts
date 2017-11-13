import OutputConfig from "./OutputConfig";
import DocProject from "../docs_models/DocProject";
import Template from "./Template";
import { GMProject, GMResource, GMScript } from "../GMInterfaces";

export default class Documentation {

    private project: GMProject;
    private resources: GMResource[];
    private docProject: DocProject;
    private template: Template;
    private config: OutputConfig;
    constructor(project: GMProject, config: OutputConfig) {
        this.project = project;
        this.config = config;
        this.resources = this.project.find(config.pattern, "script");
        if (this.resources.length == 0) {
            throw "No resources found";
        }
        this.resources.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    public async generate() {
        this.docProject = new DocProject();
        if (this.resources.length == 0) {
            throw "No resources found";
        }
        for (var file of this.resources) {
            if ((file as GMScript).parse) {
                await file.load();
                var scrArr = (file as GMScript).parse();
                this.docProject.scripts = this.docProject.scripts.concat(scrArr);
            }
        }
        this.template = new Template(this.config);
        await this.template.load();

        await this.template.generateDocs(this.docProject);
    }

}
