import Design from "../entities/Design";
import DocProject from "../../doc_models/DocProject";

export default interface IDesignRenderer {
	render(design: Design, docProject: DocProject, outputFolder: string): Promise<string>;
}