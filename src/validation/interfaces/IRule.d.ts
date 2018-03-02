import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";
import IValidableScript from "./IValidableScript";

export default interface IRule {
	isValid(element: IValidableScript): boolean;
	getWarnMessage(element: IValidableScript): string;
}