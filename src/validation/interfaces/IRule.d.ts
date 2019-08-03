import IValidationRuleConfig from "../../config/IValidationRuleConfig";
import IValidableScript from "./IValidableScript";

export default interface IRule {
	isValid(element: IValidableScript): boolean;
	getWarnMessage(element: IValidableScript): string;
}