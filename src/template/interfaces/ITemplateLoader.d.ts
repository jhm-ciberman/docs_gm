import Template from "../entities/Template";

export default interface ITemplateLoader {
	loadFrom(folder: string): Promise<Template>;
}