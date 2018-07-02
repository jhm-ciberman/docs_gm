import DocExample from "../doc_models/DocExample";
import DocParam from "../doc_models/DocParam";
import DocReturns from "../doc_models/DocReturns";
import DocScript from "../doc_models/DocScript";
import StringUtils from "./StringUtils";

/**
 * Factory class to create DocScript instances.
 * Each DocScript instance represents the documentation of a single script or subscript.
 */
export default class DocScriptFactory {

	/**
	 * If true, the arguments with the same name will be merged.
	 * If false, it will be added as different arguments.
	 */
	private _mergeDuplicateParams: boolean;

	/**
	 * The DocScript to generate
	 */
	private _script: DocScript;

	private _paramsMap: Map<string, DocParam> = new Map();

	/**
	 * Creates a DocScriptFactory to build DocScript objects.
	 */
	public constructor(name: string, mergeDuplicateParams: boolean = false) {
		this._script = new DocScript(name);
		this._mergeDuplicateParams = mergeDuplicateParams;
	}

	/**
	 * Generates the DocScript and returns it
	 * @return The generated DocScript
	 */
	public make(): DocScript {
		return this._script;
	}

	/**
	 * Parses an example tag and creates a DocExample object
	 * @param exampleString The example text
	 */
	public addExample(exampleString: string): void {
		if (exampleString !== "") {
			const example = new DocExample();
			const str = StringUtils.stripInitialLineFeeds(exampleString);
			example.code = StringUtils.escapeHtml(str);
			example.caption = "";

			this._script.examples.push(example);
			this._script.undocumented = false;
		}
	}

	/**
	 * Add a DocParam to the DocScript
	 * @param name The param name
	 * @param type The param type
	 * @param optional Is the parameter optional?
	 * @param description The description of the parameter
	 */
	public addParam(name: string, type: string, optional: boolean, description: string): void {
		const param = new DocParam();
		param.name = StringUtils.escapeHtml(name);
		param.type = type ? StringUtils.escapeHtml(type) : "";
		param.optional = optional;
		let str = StringUtils.stripInitialHypen(description);
		str = StringUtils.markdown2Html(str);
		str = StringUtils.compactHtmlSingleParagraph(str);
		param.description = str;

		const originalParam = this._paramsMap.get(param.name);
		if (originalParam) {
			if (this._mergeDuplicateParams) {
				originalParam.description += " " + param.description;
				originalParam.optional = param.optional;
				originalParam.type = param.type;
			} else {
				this._script.params.push(param);
			}
		} else {
			this._paramsMap.set(param.name, param);
			this._script.params.push(param);
		}

		this._script.undocumented = false;
	}

	/**
	 * Set the description of the DocScript
	 * @param descriptionText The description text
	 */
	public setDescription(descriptionText: string) {
		if (descriptionText !== "") {
			this._script.description = StringUtils.markdown2Html(descriptionText);
			this._script.undocumented = false;
		}
	}

	/**
	 * Set the return value documentation of the DocScript
	 * @param type The return type
	 * @param description The description of the returned value
	 */
	public setReturns(type: string, description: string) {
		this._script.returns = this._script.returns || new DocReturns();
		this._script.returns.description = description;
		this._script.returns.type = type;
		this._script.undocumented = false;
	}

	/**
	 * Mark the DocScript as private
	 */
	public markPrivate() {
		this._script.private = true;
	}

	/**
	 * Sets the function name
	 */
	public setFunction(functionName: string) {
		this._script.function = functionName;
	}

}
