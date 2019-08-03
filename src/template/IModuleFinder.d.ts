import ModuleFinderConfig from "./ModuleFinderConfig";

export default interface IModuleFinder {
	find(moduleName: string, moduleFinderConfig: ModuleFinderConfig): Promise<string>
}