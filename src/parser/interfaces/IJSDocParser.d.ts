import DocScript from "../../doc_models/DocScript";
import IReporter from "../../reporter/interfaces/IReporter";
import IParsingConfig from "../../config/interfaces/IParsingConfig";

export default interface IJSDocParser {
	parse(name: string, text: string, parsingConfig?: IParsingConfig): DocScript;
}