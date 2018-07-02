import IOutputConfig from "./IOutputConfig";
import IScriptValidationRules from "./IScriptValidationRules";
import IParsingConfig from "./IParsingConfig";


export default interface IProjectConfig {
	output: IOutputConfig;
	pattern: string;
	root: string;
	parser: IParsingConfig;
	scripts: IScriptValidationRules;
}
