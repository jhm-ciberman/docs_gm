import IScriptValidationRules from "../../config/IScriptValidationRules";
import IValidationRuleConfig from "../../config/IValidationRuleConfig";
import IRule from "./IRule";

export default interface IRulesProvider {
	getRules(): IRule[];
	getConfig(rules: IScriptValidationRules): IValidationRuleConfig[];
}