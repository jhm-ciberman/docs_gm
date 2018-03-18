import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has undocumented arguments
 */
export default class RuleUndocumentedArguments implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return !(element.doc.params.length === 0 && element.argumentCount !== 0);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" uses arguments but does not have any @param JSDoc comment.`;
	}
}
