import Template from "./Template";
import { ITemplate } from "./ITemplate";
import IOutputConfig from "../config/IOutputConfig";

export default interface ITemplateLoader {
	loadFrom(folder: string): Promise<ITemplate>;
	getFolder(output: IOutputConfig): Promise<string>;
}