import DocScript from "../doc_models/DocScript";
import IReporter from "../reporter/IReporter";

export default interface IJSDocParser {
	warnUnrecognizedTags: boolean;
	reporter: IReporter;
	parse(name: string, text: string): DocScript;
}