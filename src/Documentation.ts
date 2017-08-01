
import GMProject from "./yoyo_models/GMProject";
import GMResource from "./yoyo_models/GMResource";
import GMScript from "./yoyo_models/GMScript";
import OutputConfig from "./OutputConfig";
import DocProject from "./docs_models/DocProject";
import Template from "./Template";

export default class Documentation {

    private project:GMProject;
    private resources:GMResource[];
    private docProject:DocProject;
    private template:Template;
    private config:OutputConfig;
    constructor(project:GMProject, config:OutputConfig) {
        this.project = project;
        this.config = config;
        this.resources = this.project.find(config.pattern, "GMScript");
    }

    public async parseProject() {
        this.docProject = new DocProject();
        if (this.resources.length == 0) {
            throw "No resources found";
        }
        for (var file of this.resources) {
            if (file instanceof GMScript) {
                await file.loadGML();
                this.docProject.scripts.push(file.parse());
            }
        }
    }
    public async loadTemplate() {
        this.template = new Template(this.config);
        await this.template.load();
    }
    public async generateDocs() {
		if (!this.docProject) throw "No project loaded";
        if (!this.template)   throw "No template loaded";

        await this.template.generateDocs(this.docProject);
	}

}
