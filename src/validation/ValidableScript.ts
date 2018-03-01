import { injectable } from "inversify";

import DocScript from "../doc_models/DocScript";
import GMLParser from "./GMLParser";
import IValidableScript from "./interfaces/IValidableScript";

/**
 * This class represents a script to be validated.
 * It contains a reference to the associated DocScript object and
 * properties with features of the GMLcode (like number of arguments, etc).
 */
@injectable()
export default class ValidableScript implements IValidableScript {

	/**
	 * The DocScript object associated to this ValidableScript
	 */
	public readonly doc: DocScript;

	/**
	 * The number of arguments
	 */
	public readonly argumentCount: number;

	/**
	 * Does this script have optional arguments?
	 */
	public readonly optionalArguments: boolean;

	/**
	 * Does this script have a return statement
	 */
	public readonly hasReturn: boolean;

	/**
	 * Creates a ValidableScript
	 * @param docScript The Associated DocScript object
	 * @param gmlText The GML text of the script
	 */
	constructor(docScript: DocScript, gmlText: string) {
		this.doc = docScript;
		const parser = new GMLParser(gmlText);
		const fixedArgsN = parser.countFixedArguments();
		const optArgsN = parser.countOptionalArguments();
		this.argumentCount = Math.max(fixedArgsN, optArgsN);
		this.optionalArguments = (optArgsN !== 0);
		this.hasReturn = parser.hasReturn();
	}
}
