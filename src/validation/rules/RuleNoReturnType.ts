import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has no data type for the returned value
 */
export default class RuleNoReturnType implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		const r = element.doc.returns;
		return r === null || (r !== null && r.type !== "");
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" return documentation has no data type.`;
	}
}
