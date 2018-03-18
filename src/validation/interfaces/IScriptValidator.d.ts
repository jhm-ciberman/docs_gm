import IValidationRule from "./IValidationRule";
import IValidableScript from "./IValidableScript";
import IScriptValidationRules from "../../config/interfaces/IScriptValidationRules";

export default interface IScriptValidator {
	validate(validable: IValidableScript, rules: IScriptValidationRules): boolean;
}
