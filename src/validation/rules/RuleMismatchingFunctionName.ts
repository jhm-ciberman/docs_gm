import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if a script has a missmatching function name. That is, when the JSDoc
 * "function" tag has a different function name than the script name.
 */
export default class RuleMismatchingFunctionName implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return !(element.doc.function !== "" && element.doc.function !== element.doc.name);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" has a mismatching @function name "${element.doc.function}"`;
	}
}
