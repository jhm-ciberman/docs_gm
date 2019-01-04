import IReporter from "../../reporter/interfaces/IReporter";
import ICliParamsConfig from "../../config/interfaces/ICliParamsConfig";

export default interface ICliGenerateFacade {
	generate(projectPath?: string, overrideConfig?: ICliParamsConfig): Promise<void>;
	init(): Promise<string>;
}
