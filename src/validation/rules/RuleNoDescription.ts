import { injectable } from "inversify";
import IValidableScript from "../interfaces/IValidableScript";
import Rule from "./Rule";

/**
 * This rule checks if the script has no documented description
 */
@injectable()
export default class RuleNoDescription extends Rule<IValidableScript> {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected _validatorFunction(element: IValidableScript): boolean {
		return (!!element.doc.description);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected _messageGenerator(element: IValidableScript): string {
		return `Script "${element.doc.name}" has no description.`;
	}
}
