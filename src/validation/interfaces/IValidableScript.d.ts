import DocScript from "../../doc_models/DocScript";

export default interface IValidableScript {
	readonly argumentCount: number;
	readonly optionalArguments: boolean;
	readonly hasReturn: boolean;
	readonly doc: DocScript;
}