import { inject, injectable, interfaces } from "inversify";
import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import { TYPES } from "../types";
import IScriptValidator from "./IScriptValidator";
import IValidationRule from "./IValidationRule";
import ValidableScript from "./ValidableScript";

/**
 * This class creates multiple validator rules that can validate
 * a validable script.
 */
@injectable()
export default class ScriptValidator implements IScriptValidator {

	/**
	 * The ValidationRule constructor.
	 */
	@inject(TYPES.IValidationRule)
	private _ValidationRule: interfaces.Newable<IValidationRule<ValidableScript>>;

	/**
	 * The rules options
	 */
	@inject(TYPES.IScriptValidationRules)
	private readonly _rules: IScriptValidationRules;

	/**
	 * Rule private
	 */
	get rulePrivate(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			{ ignore: this._rules.ignorePrivate, warn: false },
			(e: ValidableScript) => !e.doc.private,
		);
	}

	/**
	 * Rule undocumented
	 */
	get ruleUndocumented(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			this._rules.undocumented,
			(e: ValidableScript) => !e.doc.undocumented,
			(e: ValidableScript) => `Script "${e.doc.name}" is undocumented.`,
		);
	}

	/**
	 * Rule undescripted
	 */
	get ruleUndescripted(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			this._rules.undescripted,
			(e: ValidableScript) => !!e.doc.description,
			(e: ValidableScript) => `Script "${e.doc.name}" has no description.`,
		);
	}

	/**
	 * Rule Mismatching Function Name
	 */
	get ruleMismatchingFunctionName(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			this._rules.mismatchingFunctionName,
			(e: ValidableScript) => !(e.doc.function !== "" && e.doc.function !== e.doc.name),
			(e: ValidableScript) => `Script "${e.doc.name}" has a mismatching @function name "${e.doc.function}"`,
		);
	}

	/**
	 * rule Mismatching Arguments
	 */
	get ruleMismatchingArguments(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			this._rules.mismatchingArguments,
			(e: ValidableScript) => !(e.argumentCount !== e.doc.params.length),
			(e: ValidableScript) => `Script "${e.doc.name}" uses ${e.argumentCount} arguments `
				+ `but has documentation for ${e.doc.params.length} arguments.`,
		);
	}

	/**
	 * rule Undocumented Arguments
	 */
	get ruleUndocumentedArguments(): IValidationRule<ValidableScript> {
		return new this._ValidationRule(
			this._rules.undocumentedArguments,
			(e: ValidableScript) => !(e.doc.params.length === 0 && e.argumentCount !== 0),
			(e: ValidableScript) => `Script "${e.doc.name}" uses arguments but does not have any @param JSDoc comment.`,
		);
	}

	/**
	 * Mark a validable script element as private if necessary
	 * @param element The ValidableScript to mark
	 */
	public markAsPrivateIfNecessary(element: ValidableScript): void {
		if (this._rules.markUnderscoreScriptsAsPrivate && element.doc.name.startsWith("_")) {
			element.doc.private = true;
		}
	}

}
