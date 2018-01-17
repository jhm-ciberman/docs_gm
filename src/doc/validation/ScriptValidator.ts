import ScriptValidationRules from "../../config/ScriptValidationRules";
import ValidableScript from "./ValidableScript";
import { ValidatorRule } from "./ValidatorRule";

/**
 * This class can validate multiple ValidableScripts
 * against the specified ScriptValidationRules.
 */
export default class ScriptValidator {

	/**
	 * The list of ValidatorRules to check
	 */
	private readonly _rulesList: Array<ValidatorRule<ValidableScript>>;

	/**
	 * The rules options
	 */
	private readonly _rules: ScriptValidationRules;
	/**
	 * Creates a new Validator
	 * @param docScript The docScript to validate
	 * @param parser The Parset to extract the GML features of the DocScript
	 * @param config The config to validate against
	 */
	public constructor(rules: ScriptValidationRules ) {
		this._rules = rules;

		const rulePrivate = new ValidatorRule<ValidableScript>(
			{ ignore: rules.ignorePrivate, warn: false },
			(e) => !e.doc.private,
			() => "",
		);

		const ruleUndocumented = new ValidatorRule<ValidableScript>(
			rules.undocumented,
			(e) => !e.doc.undocumented,
			(e) => `Script "${e.doc.name}" is undocumented.`,
		);

		const ruleUndescripted = new ValidatorRule<ValidableScript>(
			rules.undescripted,
			(e) => !e.doc.description,
			(e) => `Script "${e.doc.name}" has no description.`,
		);

		const ruleMismatchingFunctionName = new ValidatorRule<ValidableScript>(
			rules.mismatchingFunctionName,
			(e) => !(e.doc.function !== "" && e.doc.function !== e.doc.name),
			(e) => `Script "${e.doc.name}" has a mismatching @function name "${e.doc.function}"`,
		);

		const ruleMismatchingArguments = new ValidatorRule<ValidableScript>(
			rules.mismatchingArguments,
			(e) => !(e.argumentCount !== e.doc.params.length),
			(e) => `Script "${e.doc.name}" uses ${e.argumentCount} but has documentation for ${e.doc.params.length} arguments.`,
		);

		const ruleUndocumentedArguments = new ValidatorRule<ValidableScript>(
			rules.undocumentedArguments,
			(e) => !(e.doc.params.length === 0),
			(e) => `Script "${e.doc.name}" uses arguments but does not have any @param JSDoc comment.`,
		);

		this._rulesList = [
			rulePrivate,
			ruleUndocumented,
			ruleUndescripted,
			ruleMismatchingFunctionName,
			ruleMismatchingArguments,
			ruleUndocumentedArguments,
		];
	}

	/**
	 * Validates a ValidableScript against a set of predefined rules that
	 * follow the rules configuration passed on the constructor.
	 * Returns true if the script passes all the rules, false otherwise
	 * @param element The ValidableScript to validate
	 */
	public validate(element: ValidableScript): boolean {
		if (this._rules.markUnderscoreScriptsAsPrivate && element.doc.name.charAt(0) === "_") {
			element.doc.private = true;
		}
		for (const rule of this._rulesList) {
			if (!rule.validate(element)) {
				return false;
			}
		}
		return true;
	}

}
