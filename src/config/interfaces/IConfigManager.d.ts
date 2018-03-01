import IProjectConfig from "./IProjectConfig";

export default class IConfigManager {
	exportConfig(outputPath: string): Promise<string>;
	loadConfig(jsonOrProjectPath: string): Promise<IProjectConfig | undefined>;
}