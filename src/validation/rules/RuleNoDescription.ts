import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has no documented description
 */
export default class RuleNoDescription implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		return (!!element.doc.description);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" has no description.`;
	}
}
