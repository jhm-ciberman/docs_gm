import { IRoot } from "./TemplateJSON";
import { ITemplate } from "./ITemplate";

export default interface ITemplateFactory {
	create(folder: string, data: IRoot): ITemplate;
}