import IReporter from "../../reporter/interfaces/IReporter";

export default interface ICliGenerateFacade {

	open: (url: string) => void;

	reporter: IReporter;

	design: string | undefined;

	template: string | undefined;

	outputFolder: string | undefined;

	pattern: string | undefined;

	generate(projectPath?: string ): Promise<void>;
}
