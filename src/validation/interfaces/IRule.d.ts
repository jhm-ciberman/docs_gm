import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";

export default interface IRule<T> {
	validate(element: T, ruleConfig: IValidationRuleConfig): boolean;
}