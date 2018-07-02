import DocParam from "../../doc_models/DocParam";
import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has some parameter/s without description
 */
export default class RuleNoParamDescription implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return this._findEmptyDescription(element) === null;
	}

	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		const e = this._findEmptyDescription(element) as DocParam;
		return `Script "${element.doc.name}" (Argument "${e.name}") has no description.`;
	}

	private _findEmptyDescription(element: IValidableScript): DocParam | null {
		for (const param of element.doc.params) {
			if (param.description === "") {
				return param;
			}
		}
		return null;
	}
}
