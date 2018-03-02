import IRule from "./IRule";
import IValidableScript from "./IValidableScript";
import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";

export default interface IRuleValidator {
	validate(rule: IRule, script: IValidableScript, config: IValidationRuleConfig): boolean 
}