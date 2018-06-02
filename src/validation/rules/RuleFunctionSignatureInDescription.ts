import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule should detect if the description JSDoc tag has a function
 * signature instead of the actual function description.
 * This is because, when you import a GMS1 project into GMS2, the description
 * tag is filled with the function generated signature.
 */
export default class RuleFunctionSignatureInDescription implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		const d = element.doc.description.trim().split(" ").join();
		if (d === "") { return true; }
		return (!d.startsWith(element.doc.name + "("));
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		return `Script "${element.doc.name}" has the script signature on the description instead of the actual description`;
	}
}
