import DocProject from "../../doc_models/DocProject";

export default interface IDocProjectGenerator {
	generate(): Promise<DocProject>;
}