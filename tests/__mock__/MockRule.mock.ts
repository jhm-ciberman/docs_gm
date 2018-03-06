import IRule from "../../src/validation/interfaces/IRule";
import IValidableScript from "../../src/validation/interfaces/IValidableScript";

export default class MockRule implements IRule {
	public shouldReturn: boolean = true;
	public isValid(_element: IValidableScript): boolean {
		return this.shouldReturn;
	}
	public getWarnMessage(_element: IValidableScript): string {
		return "foo";
	}
}
