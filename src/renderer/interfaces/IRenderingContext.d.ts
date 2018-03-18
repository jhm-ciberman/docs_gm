import IDocElement from "../../doc_models/interfaces/IDocElement";

export default interface IRenderingContext {
	project: IDocElement;
	folder?: IDocElement;
	script?: IDocElement;
	resource?: IDocElement;
}