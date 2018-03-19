import IOutputConfig from "./IOutputConfig";
import IScriptValidationRules from "./IScriptValidationRules";


export default interface IProjectConfig {
	output: IOutputConfig;
	warnUnrecognizedTags: boolean;
	pattern: string;
	root: string;
	scripts: IScriptValidationRules;
}
