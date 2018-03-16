import IProjectConfig from "./IProjectConfig";

export default interface IConfigOverrider {
	override(config: IProjectConfig, overrideConfig: { [key: string]: string }): IProjectConfig;
}