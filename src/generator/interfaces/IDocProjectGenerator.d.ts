import DocProject from "../../doc_models/DocProject";
import IGMProject from "../../gm_project/interfaces/IGMProject";
import IProjectConfig from "../../config/interfaces/IProjectConfig";
import ISerializable from "../../doc_models/interfaces/ISerializable";
import { ISerializedProject } from "../../doc_models/interfaces/interfaces";

export default interface IDocProjectGenerator {
	generate(gmProject: IGMProject, config: IProjectConfig): Promise<DocProject>
}