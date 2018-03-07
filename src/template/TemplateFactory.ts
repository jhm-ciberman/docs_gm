import { injectable } from "inversify";
import Template from "./entities/Template";
import ITemplateFactory from "./interfaces/ITemplateFactory";
import { IRoot } from "./interfaces/TemplateJSON";

@injectable()
export default class TemplateFactory implements ITemplateFactory {
	public create(folder: string, data: IRoot) {
		return new Template(folder, data);
	}
}
