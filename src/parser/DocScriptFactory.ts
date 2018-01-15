import DocExample from "../docs_models/DocExample";
import DocParam from "../docs_models/DocParam";
import DocReturns from "../docs_models/DocReturns";
import DocScript from "../docs_models/DocScript";
import StringUtils from "./StringUtils";

/**
 * Factory class to create DocScript instances.
 * Each DocScript instance represents the documentation of a single script or subscript.
 */
export default class DocScriptFactory {

	/**
	 * The DocScript to generate
	 */
	private _script: DocScript;

	/**
	 * Creates a DocScriptFactory to build DocScript objects.
	 */
	public constructor(name: string) {
		this._script = new DocScript();
		this._script.name = name;
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
		const example = new DocExample();
		const str = StringUtils.stripInitialLineFeeds(exampleString);
		example.code = StringUtils.escapeHtml(str);

		this._script.examples.push(example);
		this._script.undocumented = false;
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
		param.type = StringUtils.escapeHtml(type);
		param.optional = optional;
		let str = StringUtils.stripInitialHypen(description);
		str = StringUtils.markdown2Html(str);
		str = StringUtils.compactHtmlSingleParagraph(str);
		param.description = str;

		this._script.params.push(param);
		this._script.undocumented = false;
	}

	/**
	 * Set the description of the DocScript
	 * @param descriptionText The description text
	 */
	public setDescription(descriptionText: string) {
		this._script.description = StringUtils.markdown2Html(descriptionText);
		this._script.undocumented = false;
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
