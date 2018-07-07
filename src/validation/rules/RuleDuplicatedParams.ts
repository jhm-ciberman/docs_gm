import IRule from "../interfaces/IRule";
import IValidableScript from "../interfaces/IValidableScript";

/**
 * This rule checks if the script has some duplicate parameter
 */
export default class RuleDuplicatedParams implements IRule {
	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	public isValid(element: IValidableScript): boolean {
		const list = this._getDuplicatedParamsList(element);
		return (list.length === 0);
	}
	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	public getWarnMessage(element: IValidableScript): string {
		const list = this._getDuplicatedParamsList(element);
		return `Script "${element.doc.name}" has duplicated ${list.join(", ")} arguments.`;
	}

	private _getDuplicatedParamsList(element: IValidableScript): string[] {
		const set = new Set<string>();
		const list: string[] = [];
		for (const param of element.doc.params) {
			if (set.has(param.name)) {
				list.push(param.name);
			} else {
				set.add(param.name);
			}
		}
		return list;
	}
}
