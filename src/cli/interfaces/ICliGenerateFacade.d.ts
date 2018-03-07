import IReporter from "../../reporter/interfaces/IReporter";

export default interface ICliGenerateFacade {

	design: string | undefined;

	template: string | undefined;

	outputFolder: string | undefined;

	pattern: string | undefined;

	open: boolean;

	generate(projectPath?: string ): Promise<void>;
}
