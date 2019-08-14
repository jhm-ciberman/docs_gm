import IRule from "./IRule";
import { IScriptValidationRules, IValidationRuleConfig } from "../../config/IProjectConfig";

export default interface IRulesProvider {
	getRules(): IRule[];
	getConfig(rules: IScriptValidationRules): IValidationRuleConfig[];
}