import { injectable } from "inversify";
import ITemplateFactory from "./interfaces/ITemplateFactory";
import { IRoot } from "./interfaces/TemplateJSON";
import Template from "./Template";

@injectable()
export default class TemplateFactory implements ITemplateFactory {
	public create(folder: string, data: IRoot) {
		return new Template(folder, data);
	}
}
