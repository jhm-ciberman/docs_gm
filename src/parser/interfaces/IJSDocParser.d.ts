import DocScript from "../../doc_models/DocScript";
import IReporter from "../../reporter/interfaces/IReporter";

export default interface IJSDocParser {
	warnUnrecognizedTags: boolean;
	parse(name: string, text: string): DocScript;
}