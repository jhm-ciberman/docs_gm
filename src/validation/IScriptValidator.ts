import IValidationRule from "./IValidationRule";
import ValidableScript from "./ValidableScript";

export default interface IScriptValidator {
	readonly rulePrivate: IValidationRule<ValidableScript>;
	readonly ruleUndocumented: IValidationRule<ValidableScript>;
	readonly ruleUndescripted: IValidationRule<ValidableScript>;
	readonly ruleMismatchingFunctionName: IValidationRule<ValidableScript>;
	readonly ruleMismatchingArguments: IValidationRule<ValidableScript>;
	readonly ruleUndocumentedArguments: IValidationRule<ValidableScript>;
	markAsPrivateIfNecessary(element: ValidableScript): void;
}
