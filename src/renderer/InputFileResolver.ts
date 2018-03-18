import { injectable } from "inversify";
import { DocElementType } from "../doc_models/enums/DocElementType";
import Design from "../template/Design";
import IInputFileResolver from "./interfaces/IInputFileResolver";

@injectable()
export default class InputFileResolver implements IInputFileResolver {
	public resolve(design: Design, type: DocElementType): string {
		let inputFile: string = "";
		switch (type) {
			case DocElementType.Script:
				inputFile = design.script;
				break;
			case DocElementType.Folder:
				inputFile =  design.folder;
				break;
			case DocElementType.Project:
				inputFile =  design.index;
				break;
			case DocElementType.Resource:
				inputFile =  design.resource;
				break;
		}
		if (inputFile === "") {
			throw new Error("Cannot resolve a template input file for the given element type: " + type);
		}
		return inputFile;
	}
}
