import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";
import IRule from "./IRule";

export default interface IRulesProvider {
	getRules(): IRule[];
	getConfig(rules: IScriptValidationRules): IValidationRuleConfig[];
}