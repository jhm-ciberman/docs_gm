import Template from "./Template";
import { IOutputConfig } from "../config/IProjectConfig";

export default interface ITemplateLoader {
	loadFrom(folder: string): Promise<Template>;
	getFolder(output: IOutputConfig): Promise<string>;
}