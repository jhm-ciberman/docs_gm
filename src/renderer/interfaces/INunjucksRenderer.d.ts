import Design from "../../template/entities/Design";
import DocProject from "../../doc_models/DocProject";

export default interface INunjucksRenderer {
	render(design: Design, docProject: DocProject, outputFolder: string): Promise<void>;
}