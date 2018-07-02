import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has a return statement
 * but has not documentation for the returned value
 */
export default class RuleNoReturnDescription implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		if (element.hasReturn) {
			const r = element.doc.returns;
			return !(r === null || (r !== null && r.description === ""));
		}
		return true;
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" has a return statement, but has no documentation for the returned value`;
	}
}
