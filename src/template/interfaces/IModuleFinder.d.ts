export default interface IModuleFinder {
	find(moduleName: string): Promise<string>
}