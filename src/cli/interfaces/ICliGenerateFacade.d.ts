import IReporter from "../../reporter/interfaces/IReporter";

export default interface ICliGenerateFacade {

	open: (url: string) => void;

	design: string | undefined;

	template: string | undefined;

	outputFolder: string | undefined;

	pattern: string | undefined;

	generate(projectPath?: string ): Promise<void>;
}
