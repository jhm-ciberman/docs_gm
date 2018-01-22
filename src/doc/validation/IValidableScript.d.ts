import DocScript from "../models/DocScript";

export default interface IValidableScript {
	doc: DocScript;
	argumentCount: number;
	optionalArguments: boolean;
	hasReturn: boolean;
}