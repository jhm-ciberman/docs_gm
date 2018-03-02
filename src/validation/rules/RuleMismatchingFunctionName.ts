import { injectable } from "inversify";
import IValidableScript from "../interfaces/IValidableScript";
import Rule from "./Rule";

/**
 * This rule checks if a script has a missmatching function name. That is, when the JSDoc
 * "function" tag has a different function name than the script name.
 */
@injectable()
export default class RuleMismatchingFunctionName extends Rule<IValidableScript> {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected _validatorFunction(element: IValidableScript): boolean {
		return !(element.doc.function !== "" && element.doc.function !== element.doc.name);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected _messageGenerator(element: IValidableScript): string {
		return `Script "${element.doc.name}" has a mismatching @function name "${element.doc.function}"`;
	}
}
