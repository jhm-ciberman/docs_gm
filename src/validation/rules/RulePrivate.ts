import { injectable } from "inversify";
import IValidableScript from "../interfaces/IValidableScript";
import Rule from "./Rule";

/**
 * This rule checks if the script is private
 */
@injectable()
export default class RulePrivate extends Rule<IValidableScript> {

	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected _validatorFunction(element: IValidableScript): boolean {
		return !element.doc.private;
	}

	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected _messageGenerator(element: IValidableScript): string {
		return `Script "${element.doc.name}" is private.`;
	}
}
