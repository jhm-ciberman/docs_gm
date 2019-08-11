import ICliParamsConfig from "./ICliParamsConfig";
import { IProjectConfig } from "./IProjectConfig";

export default interface IConfigOverrider {
	override(config: IProjectConfig, overrideConfig: ICliParamsConfig): IProjectConfig;
}