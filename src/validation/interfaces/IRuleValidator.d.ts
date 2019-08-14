import IRule from "./IRule";
import IValidableScript from "./IValidableScript";
import { IValidationRuleConfig } from "../../config/IProjectConfig";

export default interface IRuleValidator {
	validate(rule: IRule, script: IValidableScript, config: IValidationRuleConfig): boolean 
}