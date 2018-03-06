import IOutputConfig from "../../config/interfaces/IOutputConfig";
import Design from "../entities/Design";

export default interface IDesignLoader {
	load(output: IOutputConfig): Promise<Design>;
}