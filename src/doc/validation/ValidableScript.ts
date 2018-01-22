import DocScript from "../models/DocScript";
import GMLParser from "./GMLParser";
import IValidableScript from "./IValidableScript";

/**
 * This class represents a script to be validated.
 * It contains a reference to the asociated DocScript object and
 * properties with features of the GMLcode (like number of arguments, etc).
 */
export default class ValidableScript implements IValidableScript {

	/**
	 * The DocScript object asociated to this ValidableScript
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
	 * Does this script have a return statment
	 */
	public readonly hasReturn: boolean;

	/**
	 * Creates a ValidableScript
	 * @param docScript The Asociated DocScript object
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
