import Template from "../template/Template";
import RenderingQueue from "./RenderingQueue";

export default interface IRenderer {
	render(template: Template, queue: RenderingQueue, outputFolder: string): Promise<void>;
}
