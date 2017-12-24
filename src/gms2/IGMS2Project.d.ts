import * as IGMInterfaces from "../IGMInterfaces";
import GMS2Resource from "./GMS2Resource";

export default interface IGMS2Project extends IGMInterfaces.IGMProject {
	getResourceById(id: string): GMS2Resource | undefined;
}
