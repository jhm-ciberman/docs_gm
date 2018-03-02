import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * Checks if a ValidableScript has a missmatching documented argument count. For example,
 * if a script uses 3 arguments but has documentation for only 2 arguments.
 */
export default class RuleMismatchingArguments implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return !(element.argumentCount !== element.doc.params.length);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" uses ${element.argumentCount} arguments `
			+ `but has documentation for ${element.doc.params.length} arguments.`;
	}
}
