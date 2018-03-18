import Design from "../../template/Design";
import { DocElementType } from "../../doc_models/enums/DocElementType";

export default interface IInputFileResolver {
	resolve(design: Design, type: DocElementType): string
}