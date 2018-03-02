import { injectable } from "inversify";
import IValidableScript from "../interfaces/IValidableScript";
import Rule from "./Rule";

/**
 * This rule checks if the script has undocumented arguments
 */
@injectable()
export default class RuleUndocumentedArguments extends Rule<IValidableScript> {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected _validatorFunction(element: IValidableScript): boolean {
		return !(element.doc.params.length === 0 && element.argumentCount !== 0);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected _messageGenerator(element: IValidableScript): string {
		return `Script "${element.doc.name}" uses arguments but does not have any @param JSDoc comment.`;
	}
}
