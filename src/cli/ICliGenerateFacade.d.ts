import IReporter from "../reporter/IReporter";
import ICliParamsConfig from "../config/ICliParamsConfig";

export default interface ICliGenerateFacade {
	generate(projectPath?: string, overrideConfig?: ICliParamsConfig): Promise<void>;
	init(): Promise<string>;
}
