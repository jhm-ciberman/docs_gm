import DocScript from "../doc_models/DocScript";
import IReporter from "../reporter/IReporter";
import { IParsingConfig } from "../config/IProjectConfig";

export default interface IJSDocParser {
	parse(name: string, text: string, parsingConfig?: IParsingConfig): DocScript;
}