import DocParam from "../../doc_models/DocParam";
import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has some parameter/s without type
 */
export default class RuleNoParamType implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return this._findEmptyType(element) === null;
	}

	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		const e = this._findEmptyType(element) as DocParam;
		return `Script "${element.doc.name}" (Argument "${e.name}") has no type.`;
	}

	private _findEmptyType(element: IValidableScript): DocParam | null {
		for (const param of element.doc.params) {
			if (param.type === "") {
				return param;
			}
		}
		return null;
	}
}
