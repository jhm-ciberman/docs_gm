import { injectable } from "inversify";
import ITemplateFactory from "./ITemplateFactory";
import Template from "./Template";
import { IRoot } from "./TemplateJSON";

@injectable()
export default class TemplateFactory implements ITemplateFactory {
	public create(folder: string, data: IRoot) {
		return new Template(folder, data);
	}
}
