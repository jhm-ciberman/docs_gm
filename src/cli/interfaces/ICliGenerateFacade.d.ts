import IReporter from "../../reporter/interfaces/IReporter";

export default interface ICliGenerateFacade {
	generate(projectPath?: string, overrideConfig?: { [key: string]: string }): Promise<void>;
	init(): Promise<string>;
}
