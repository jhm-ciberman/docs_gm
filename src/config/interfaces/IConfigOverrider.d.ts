import IProjectConfig from "./IProjectConfig";
import ICliParamsConfig from "./ICliParamsConfig";

export default interface IConfigOverrider {
	override(config: IProjectConfig, overrideConfig: ICliParamsConfig): IProjectConfig;
}