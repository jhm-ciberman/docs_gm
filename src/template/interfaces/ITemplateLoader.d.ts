import Template from "../entities/Template";
import { ITemplate } from "./ITemplate";

export default interface ITemplateLoader {
	loadFrom(folder: string): Promise<ITemplate>;
}