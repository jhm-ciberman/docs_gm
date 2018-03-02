import { injectable } from "inversify";
import IValidableScript from "../interfaces/IValidableScript";
import Rule from "./Rule";

/**
 * Checks if a ValidableScript has a missmatching documented argument count. For example,
 * if a script uses 3 arguments but has documentation for only 2 arguments.
 */
@injectable()
export default class RuleMismatchingArguments extends Rule<IValidableScript> {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected _validatorFunction(element: IValidableScript): boolean {
		return !(element.argumentCount !== element.doc.params.length);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected _messageGenerator(element: IValidableScript): string {
		return `Script "${element.doc.name}" uses ${element.argumentCount} arguments `
			+ `but has documentation for ${element.doc.params.length} arguments.`;
	}
}
