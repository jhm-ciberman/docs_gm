import DocScript from "../../../../../src/doc_models/DocScript";
import IValidableScript from "../../../../../src/validation/interfaces/IValidableScript";

/* tslint:disable:completed-docs */

export default class MockValidableScript implements IValidableScript {
	public argumentCount: number = 0;
	public optionalArguments: boolean = false;
	public hasReturn: boolean = false;
	public doc: DocScript = new DocScript("foo");
}
