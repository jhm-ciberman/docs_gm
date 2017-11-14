import * as path from "path";

import OutputConfig from "./OutputConfig";
import DocProject from "../docs_models/DocProject";
import Template from "./Template";
import ScriptParser from "./ScriptParser";

import { GMProject, GMScript } from "../GMInterfaces";

/**
 * Represents the documentation for a GMProject
 */
export default class Documentation {

    /**
     * Generates the documentation files for the project.
     * @return Promise with the path of the output folder
     */
    public static async generate(project:GMProject, config?: OutputConfig): Promise<string> {
        if (!config) {
            config = new OutputConfig();
        }

        var scripts = project.find(config.pattern, "script") as GMScript[];
        scripts.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        if (scripts.length == 0) {
            throw "No resources found";
        } 

        var parser = new ScriptParser(config);
        var docProject = new DocProject();
        docProject.name = project.name;
        for (var script of scripts) {
            await script.load(); 
            var scrArr = parser.parseScript(script);
            docProject.scripts = docProject.scripts.concat(scrArr);
        }

        if (config.templatesFolder != "") {
            var folder = path.resolve(config.templatesFolder, config.templateName);
        } else {
            var folder = path.resolve(__dirname, "../../templates/", config.templateName);
        }
        
        var template = new Template(folder);
        await template.load();
        await template.generateDocs(docProject, config);

        return config.outFolder;
    }

}
