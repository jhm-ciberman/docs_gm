import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import ValidableScript from "./ValidableScript";
import ValidationRule from "./ValidationRule";

/**
 * This class creates multiple validator rules that can validate
 * a validable script.
 */
export default class ScriptValidator {

	/**
	 * Rule private
	 */
	get rulePrivate() {
		return new ValidationRule<ValidableScript>(
			{ ignore: this._rules.ignorePrivate, warn: false },
			(e) => !e.doc.private,
		);
	}

	/**
	 * Rule undocumented
	 */
	get ruleUndocumented() {
		return new ValidationRule<ValidableScript>(
			this._rules.undocumented,
			(e) => !e.doc.undocumented,
			(e) => `Script "${e.doc.name}" is undocumented.`,
		);
	}

	/**
	 * Rule undescripted
	 */
	get ruleUndescripted() {
		return new ValidationRule<ValidableScript>(
			this._rules.undescripted,
			(e) => !!e.doc.description,
			(e) => `Script "${e.doc.name}" has no description.`,
		);
	}

	/**
	 * Rule Mismatching Function Name
	 */
	get ruleMismatchingFunctionName() {
		return new ValidationRule<ValidableScript>(
			this._rules.mismatchingFunctionName,
			(e) => !(e.doc.function !== "" && e.doc.function !== e.doc.name),
			(e) => `Script "${e.doc.name}" has a mismatching @function name "${e.doc.function}"`,
		);
	}

	/**
	 * rule Mismatching Arguments
	 */
	get ruleMismatchingArguments() {
		return new ValidationRule<ValidableScript>(
			this._rules.mismatchingArguments,
			(e) => !(e.argumentCount !== e.doc.params.length),
			(e) => `Script "${e.doc.name}" uses ${e.argumentCount} arguments `
				+ `but has documentation for ${e.doc.params.length} arguments.`,
		);
	}

	/**
	 * rule Undocumented Arguments
	 */
	get ruleUndocumentedArguments() {
		return new ValidationRule<ValidableScript>(
			this._rules.undocumentedArguments,
			(e) => !(e.doc.params.length === 0 && e.argumentCount !== 0),
			(e) => `Script "${e.doc.name}" uses arguments but does not have any @param JSDoc comment.`,
		);
	}

	/**
	 * The rules options
	 */
	private readonly _rules: IScriptValidationRules;

	/**
	 * Creates a new Validator
	 * @param rules The validation rules options to configure the validation rules
	 */
	public constructor(rules: IScriptValidationRules ) {
		this._rules = rules;
	}

	/**
	 * Mark a validable script element as private if necessary
	 * @param element The ValidableScript to mark
	 */
	public markAsPrivateIfNecessary(element: ValidableScript): void {
		if (this._rules.markUnderscoreScriptsAsPrivate && element.doc.name.charAt(0) === "_") {
			element.doc.private = true;
		}
	}

}
