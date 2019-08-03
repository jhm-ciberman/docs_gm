import IProjectConfig from "./IProjectConfig";

export default interface IConfigManager {
	exportConfig(outputPath: string): Promise<string>;
	loadConfig(jsonOrProjectPath: string): Promise<IProjectConfig | undefined>;
}
