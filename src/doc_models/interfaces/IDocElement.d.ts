import { DocElementType } from "../enums/DocElementType";

export default interface IDocElement {
	readonly type: DocElementType;
	readonly name: string;
}